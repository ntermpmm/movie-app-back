const { Movie } = require("../models");
const createError = require("../utils/createError");
const cloudinary = require("../utils/cloudinary");
const fs = require("fs");
const { Op } = require("sequelize");

exports.getAllMovie = async (req, res, next) => {
    try {
        const presentYear = new Date().getFullYear();

        const {
            rating,
            minimumYear = 1,
            maximumYear = presentYear,
            title,
        } = req.query;
        console.log(req.query);
        const whereOption = {};
        if (rating !== "All") {
            whereOption.rating = rating;
        }
        if (minimumYear) {
            whereOption.year = {
                [Op.between]: [minimumYear, maximumYear],
            };
        }
        if (maximumYear) {
            whereOption.year = {
                [Op.between]: [minimumYear, maximumYear],
            };
        }

        if (title) {
            whereOption.title = { [Op.like]: `%${title}%` };
        }

        const movies = await Movie.findAll({
            where: whereOption,
            order: [["title", "ASC"]],
        });
        res.json({ movies });
        req.movie = movies;
    } catch (err) {
        next(err);
    }
};

exports.getMovieById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const movie = await Movie.findOne({
            where: { id: id },
        });
        res.json({ movie });
    } catch (err) {
        next(err);
    }
};

exports.createMovie = async (req, res, next) => {
    try {
        if (req.user.role === "MANAGER") {
            const { title, year, rating } = req.body;
            if (!title) {
                createError("title is required", 400);
            }
            if (!year) {
                createError("year is required", 400);
            }
            if (!rating) {
                createError("rating is required", 400);
            }

            let moviePhoto;
            if (req.file) {
                const result = await cloudinary.upload(req.file.path);
                moviePhoto = result.secure_url;
            }
            if (!moviePhoto) {
                createError("movie photo is required", 400);
            }

            const movie = await Movie.create({
                moviePhoto,
                title,
                year,
                rating,
            });
            res.status(201).json({
                movie: movie,
                message: "Create Movie success",
            });
        } else {
            createError("You are not authorized to create movie", 401);
        }
    } catch (err) {
        next(err);
    }
    // finally
    // {
    //     if (req.file) {
    //         fs.unlinkSync(req.files.path);
    //     }
    // }
};

exports.updateMovie = async (req, res, next) => {
    try {
        if (req.user.role === "MANAGER") {
            const { id } = req.params;
            const { title, year, rating } = req.body;

            let moviePhoto;
            if (req.file) {
                const result = await cloudinary.upload(req.file.path);
                moviePhoto = result.secure_url;
            }

            const result = await Movie.update(
                {
                    title,
                    moviePhoto,
                    year,
                    rating,
                },
                { where: { id } }
            );
            if (result[0] === 0) {
                createError("movie with this id not found", 400);
            }
            res.json({ message: "update Movie success" });
        } else {
            createError("You are not authorized to update movie", 401);
        }
    } catch (err) {
        next(err);
    }
};

exports.deleteMovie = async (req, res, next) => {
    try {
        if (req.user.role === "MANAGER") {
            const { id } = req.params;
            const result = await Movie.destroy({
                where: { id: id },
            });
            if (result === 0) {
                createError("movie with this id not found", 400);
            }
            res.json({ message: "delete Movie success" });
        } else {
            createError("You are not authorized to delete movie", 401);
        }
    } catch (err) {
        next(err);
    }
};
