const { Sequelize } = require('sequelize');

const { object, string } = require('yup');

require('dotenv').config();

const { MYSQLHOST, MYSQLUSER, MYSQLDATABASE, MYSQLPASSWORD, MYSQLPORT } =
    process.env;

const { BASE_FRONTEND_URL } = require('./constants');

const loggerConfig = {
    method: {
        error: 'errorLogger',
        request: 'logger',
    },
    file: {
        error: 'error.log',
        request: 'request.log',
    },
};

const corsConfig = {
    origin: BASE_FRONTEND_URL,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    preflightContinue: false,
    optionsSuccessStatus: 204,
    allowedHeaders: ['Content-Type', 'origin', 'Authorization'],
    credentials: true,
};

const sequelize = new Sequelize(MYSQLDATABASE, MYSQLUSER, MYSQLPASSWORD, {
    dialect: 'mysql',
    dialectOptions: {
        host: MYSQLHOST,
        port: MYSQLPORT,
    },
});

const eventsConfig = {
    connection: 'connection',
    autocomplete: 'autocomplete',
    authorization: 'authorization',
    signOut: 'signOut',
    incomingMessage: 'incomingMessage',
    sendMessage: 'sendMessage',
    error: 'error',
};

const webSocketsServerConfig = {
    cors: {
        origin: [BASE_FRONTEND_URL],
        credentials: true,
    },
};

const validationConfig = {
    authorization: object({
        name: string().required(),
    }),
    message: object({
        from: string().required(),
        to: string().required(),
        subject: string().required(),
        message: string().required(),
    }),
}

module.exports = {
    corsConfig,
    loggerConfig,
    sequelize,
    eventsConfig,
    webSocketsServerConfig,
    validationConfig,
};
