const { Op } = require('sequelize');

const User = require('../models/user');

class Users {
    _createUser = (name) => User.create({ name });

    _findUserByName = (name) =>
        User.findAll({
            where: { name },
        })
            .then((data) => data.filter((user) => user.name === name))
            .then((data) => data[0]);

    findOrCreateUser = async (name) => {
        let user = await this._findUserByName(name);
        if (!user) {
            user = await this._createUser(name);
        }
        return user;
    };

    gatUsersNames = async () =>
        User.findAll().then((users) => users.map((user) => user.name));
}

module.exports = Users;
