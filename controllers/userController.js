const { User } = require("../models");
const createError = require("../utils/createError");
const cloudinary = require("../utils/cloudinary");
const fs = require("fs");

exports.getAllUser = async (req, res, next) => {
    try {
        if (req.user.role === "MANAGER") {
            const user = await User.findAll();
            console.log(user);
            res.json({ user });
        } else {
            createError("You are not authorized to get all user", 401);
        }
    } catch (err) {
        next(err);
    }
};

exports.getUser = async (req, res, next) => {
    try {
        const { id } = req.user;
        const user = await User.findOne({
            where: { id },
        });
        res.json({ user });
    } catch (err) {
        next(err);
    }
};

exports.updateUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        if (id != req.user.id) {
            createError("You are not authorized to update this user", 401);
        }

        let profilePic;
        if (req.file) {
            const result = await cloudinary.upload(req.file.path);
            profilePic = result.secure_url;
        }

        const result = await User.update(
            {
                name,
                profilePic,
            },
            { where: { id } }
        );

        if (result[0] === 0) {
            createError("photo with this id not found", 400);
        }
        res.json({ message: "update User success" });
    } catch (err) {
        next(err);
    } finally {
        if (req.files) {
            const { image } = req.files;
            fs.unlinkSync(image[0].path);
        }
    }
};
