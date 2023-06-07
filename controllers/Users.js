const User = require('../models/user');

class Users {
    findOrCreateUser = (name) =>
        User.findOrCreate({ where: { name }, defaults: { name } }).then(
            (data) => data[0]
        );

    gatUsersNames = async () =>
        User.findAll().then((users) => users.map((user) => user.name));
}

module.exports = Users;
