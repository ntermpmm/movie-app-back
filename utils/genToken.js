const jwt = require("jsonwebtoken");
exports.user = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET_KEY_USER, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
};
