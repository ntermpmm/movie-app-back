const express = require("express");
const movieController = require("../controllers/movieController");
const authenticate = require("../middleware/authenticate");
const upload = require("../middleware/upload");

const router = express.Router();

router.post("/", upload.single("moviePhoto"), movieController.createMovie);
router.get("/allMovie", movieController.getAllMovie);
router.get("/:id", movieController.getMovieById);
router.put("/:id", upload.single("moviePhoto"), movieController.updateMovie);
router.delete("/:id", authenticate, movieController.deleteMovie);

module.exports = router;
