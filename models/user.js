const { DataTypes } = require('sequelize');

const { sequelize } = require('../utils/configs');

const User = sequelize.define(
    'Users',
    {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        freezeTableName: true,
        timestamps: false,
    }
);

module.exports = User;
