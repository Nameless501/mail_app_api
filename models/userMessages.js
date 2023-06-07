const { DataTypes } = require('sequelize');

const { sequelize } = require('../utils/configs');

const User = require('./user');

const Message = require('./message');

const UserMessages = sequelize.define(
    'UserMessages',
    {
        MessageId: {
            type: DataTypes.INTEGER,
            references: {
                model: Message,
                key: 'id',
            },
        },
        UserId: {
            type: DataTypes.INTEGER,
            references: {
                model: User,
                key: 'id',
            },
        },
    },
    {
        timestamps: false,
    }
);

Message.belongsToMany(User, { through: UserMessages });

User.belongsToMany(Message, { through: UserMessages });

sequelize.sync({ alter: true });

module.exports = { User, Message };
