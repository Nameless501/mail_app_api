const io = require('socket.io');

const { eventsConfig, webSocketsServerConfig, validationConfig } = require('../utils/configs');

const { DEFAULT_ERROR_MESSAGE } = require('../utils/constants');

class Connection {
    constructor({
        server,
        saveMessage,
        findOrCreateUser,
        getUserMessages,
        gatUsersNames,
    }) {
        this._server = server;
        this._saveMessage = saveMessage;
        this._findOrCreateUser = findOrCreateUser;
        this._getUserMessages = getUserMessages;
        this._gatUsersNames = gatUsersNames;
        this._usersMap = {};
    }

    _createWebSocketServerInstance = () => {
        this._webSocketServer = new io.Server(
            this._server,
            webSocketsServerConfig
        );
    };

    _validateData = (data, config) => {
        const isValid = config.isValidSync(data);
        if(!isValid) {
            throw new Error();
        }
    }

    _handleError = (socket) => {
        socket.emit(eventsConfig.error, DEFAULT_ERROR_MESSAGE);
    };

    _sendToReceiver = (socket, message) => {
        try {
            const receiver = this._usersMap[message.to];
            if (receiver) {
                this._webSocketServer
                    .to(receiver)
                    .emit(eventsConfig.incomingMessage, message);
            }
        } catch {
            this._handleError(socket);
        }
    };

    _handleMessageSend = async (data, socket) => {
        try {
            this._validateData(data, validationConfig.message);
            const message = await this._saveMessage(data);
            socket.emit(eventsConfig.sendMessage, message);
            this._sendToReceiver(socket, message);
        } catch {
            this._handleError(socket);
        }
    };

    _handleAuthorization = async (data, socket) => {
        try {
            this._validateData(data, validationConfig.authorization);
            this._usersMap[data.name] = socket.id;
            const user = await this._findOrCreateUser(data.name);
            const messages = await this._getUserMessages(user.id);
            socket.emit(eventsConfig.authorization, { user, messages });
        } catch {
            this._handleError(socket);
        }
    };

    _handleSignOut = ({ name }) => {
        delete this._usersMap[name];
    };

    _sendAutocompleteHint = async (socket) => {
        try {
            const names = await this._gatUsersNames();
            socket.emit(eventsConfig.autocomplete, names);
        } catch {
            this._handleError(socket);
        }
    }

    _handleConnection = async (socket) => {
        socket.on(eventsConfig.authorization, (data) =>
            this._handleAuthorization(data, socket)
        );
        socket.on(eventsConfig.sendMessage, (data) =>
            this._handleMessageSend(data, socket)
        );
        socket.on(eventsConfig.signOut, this._handleSignOut);
        socket.on(eventsConfig.autocomplete, () => this._sendAutocompleteHint(socket));
    };

    createWebSocketServer = () => {
        this._createWebSocketServerInstance();
        this._webSocketServer.on(
            eventsConfig.connection,
            this._handleConnection
        );
    };
}

module.exports = Connection;
