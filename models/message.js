const { DataTypes } = require('sequelize');

const { sequelize } = require('../utils/configs');

const Message = sequelize.define(
    'Messages',
    {
        subject: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        message: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        from: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        to: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        timestamps: true,
        updatedAt: false,
        freezeTableName: true,
    }
);

module.exports = Message;
