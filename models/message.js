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
            type: DataTypes.STRING,
            allowNull: false,
        },
        from: {
            type: DataTypes.STRING,
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
