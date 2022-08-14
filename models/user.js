module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define(
        "User",
        {
            name: {
                type: DataTypes.STRING,
            },
            username: {
                type: DataTypes.STRING,
                unique: true,
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            role: {
                type: DataTypes.ENUM("MANAGER", "TEAMLEADER", "FLOORSTAFF"),
            },
            profilePic: DataTypes.STRING,
        },
        {
            underscored: true,
        }
    );

    return User;
};
