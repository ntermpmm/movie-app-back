const jwt = require("jsonwebtoken");
const createError = require("../utils/createError");
const { User } = require("../models");

module.exports = async (req, res, next) => {
    try {
        const { authorization } = req.headers;
        if (!authorization || !authorization.startsWith("Bearer")) {
            createError("you are unauthorized from first", 401);
        }
        const token = authorization.split(" ")[1];
        if (!token) {
            createError("you are unauthorized from token", 401);
        }

        const payload = jwt.verify(token, process.env.JWT_SECRET_KEY_USER);
        const user = await User.findOne({
            where: { id: payload.id },
            attributes: { exclude: ["password"] },
        });
        if (!user) {
            createError("you are unauthorized from user", 401);
        }
        req.user = user;
        console.log("test last");

        next();
    } catch (err) {
        next(err);
    }
};
