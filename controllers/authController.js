const bcrypt = require("bcryptjs");
const { User } = require("../models");
const createError = require("../utils/createError");
const genToken = require("../utils/genToken");

exports.login = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({
            where: {
                username: username,
            },
        });
        if (!user) {
            createError("username or password is incorrect", 400);
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            createError("username or password is incorrect", 400);
        }

        const token = genToken.user({ id: user.id });
        res.json({ token: token });
    } catch (err) {
        next(err);
    }
};

exports.signup = async (req, res, next) => {
    try {
        const { username, name, password, confirmPassword, role } = req.body;

        if (!username) {
            createError("username is required", 400);
        }

        if (!name) {
            createError("name is required", 400);
        }

        if (!password) {
            createError("password required", 400);
        }

        if (password !== confirmPassword) {
            createError("password and confirm password did not match", 400);
        }

        const existUsername = await User.findOne({
            where: {
                username: username,
            },
        });

        if (existUsername) {
            createError("Username already exists", 400);
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const user = await User.create({
            name: name,
            username: username,
            password: hashedPassword,
            role,
        });

        const token = genToken.user({ id: user.id });
        res.status(201).json({ token });
    } catch (err) {
        console.log(err);
        next(err);
    }
};
