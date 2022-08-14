module.exports = (sequelize, DataTypes) => {
    const Movie = sequelize.define(
        "Movie",
        {
            moviePhoto: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            title: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            year: {
                type: DataTypes.INTEGER.UNSIGNED,
                allowNull: false,
            },
            rating: {
                type: DataTypes.ENUM("G", "PG", "M", "MA", "R"),
            },
        },
        {
            underscored: true,
        }
    );

    return Movie;
};
