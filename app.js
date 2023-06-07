const express = require('express');

require('dotenv').config();

const { PORT } = process.env;

const http = require('http');

const Connection = require('./controllers/Connection');

const Messages = require('./controllers/Messages');

const Users = require('./controllers/Users');

const app = express();

const server = http.createServer(app);

const users = new Users();

const messages = new Messages(users.findOrCreateUser);

const connection = new Connection({
    server,
    saveMessage: messages.saveMessage.bind(messages),
    getUserMessages: messages.getUserMessages.bind(messages),
    findOrCreateUser: users.findOrCreateUser.bind(users),
    gatUsersNames: users.gatUsersNames.bind(users),
});

connection.createWebSocketServer();

server.listen(PORT);
