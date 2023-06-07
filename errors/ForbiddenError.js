const { FORBIDDEN_CODE, FORBIDDEN_MESSAGE } = require('../utils/constants');

class ForbiddenError extends Error {
    constructor(message = FORBIDDEN_MESSAGE) {
        super(message);

        this.name = 'ForbiddenError';

        this.statusCode = FORBIDDEN_CODE;
    }
}

module.exports = ForbiddenError;
