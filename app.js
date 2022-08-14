require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const errorMiddleWare = require("./middleware/error");
const notFoundMiddleWare = require("./middleware/notFound");

const authRoute = require("./routes/authRoute");
const userRoute = require("./routes/userRoute");
const movieRoute = require("./routes/movieRoute");
const authenticate = require("./middleware/authenticate");

const app = express();
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// const { sequelize } = require("./models");
// sequelize.sync({ force: true });

app.use("/auth", authRoute);
app.use("/user", authenticate, userRoute);
app.use("/movie", authenticate, movieRoute);

app.use(errorMiddleWare);
app.use(notFoundMiddleWare);

app.listen(process.env.PORT || 8000, () =>
    console.log(
        "\n",
        "\n",
        "\n",
        `Sever is running on port ${process.env.PORT}`
    )
);
