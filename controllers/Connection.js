const io = require('socket.io');

const { eventsConfig, webSocketsServerConfig } = require('../utils/configs');

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

    _handleError = (socket) => {
        socket.emit(eventsConfig.error, DEFAULT_ERROR_MESSAGE);
    };

    _sendToReceiver = (socket, message) => {
        try {
            const receiver = this._usersMap[message.to];
            if (receiver) {
                this._webSocketServer
                    .to(receiver)
                    .emit(eventsConfig.newMessage, message);
            }
        } catch {
            this._handleError(socket);
        }
    };

    _handleMessageSend = async (data, socket) => {
        try {
            const message = await this._saveMessage(data);
            socket.emit(eventsConfig.messageSent, message);
            this._sendToReceiver(socket, message);
        } catch {
            this._handleError(socket);
        }
    };

    _handleAuthorization = async (data, socket) => {
        try {
            this._usersMap[data] = socket.id;
            const user = await this._findOrCreateUser(data);
            const messages = await this._getUserMessages(user.id);
            socket.emit(eventsConfig.authorized, { user, messages });
        } catch {
            this._handleError(socket);
        }
    };

    _handleSignOut = ({ name }) => {
        delete this._usersMap[name];
    };

    _handleConnection = async (socket) => {
        socket.on(eventsConfig.authorization, (data) =>
            this._handleAuthorization(data, socket)
        );
        socket.on(eventsConfig.sendMessage, (data) =>
            this._handleMessageSend(data, socket)
        );
        socket.on(eventsConfig.signOut, this._handleSignOut);
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
