const { Message, User } = require('../models/userMessages');

class Messages {
    constructor(findOrCreateUser) {
        this._findOrCreateUser = findOrCreateUser;
    }

    saveMessage = async ({ from, to, subject, message }) => {
        const users = await Promise.all(
            [...new Set([from, to])].map((user) => this._findOrCreateUser(user))
        );
        const newMessage = await Message.create({ subject, message, from, to });
        users.forEach((user) => user.addMessages(newMessage));
        return newMessage;
    };

    getUserMessages = async (id) =>
        Message.findAll({
            include: {
                model: User,
                where: {
                    id,
                },
            },
        }).then((messages) =>
            [...messages].sort(
                (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            )
        );
}

module.exports = Messages;
