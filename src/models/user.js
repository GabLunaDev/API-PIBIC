const sequelize = require("../config/sequelize");
const { DataTypes } = require("sequelize");

const user = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "user",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        unique: true,
      },
      name: {
        type: DataTypes.STRING(500),
        allowNull: false,
        comment: "user's name"
      },
      first_access: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
        comment: "if is the first acces of the user"
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: "user's username"
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: "user's password"
      }
    },
    { freezeTableName: true }
  );

  User.associate = function (models) {};
  return User;
};
module.exports = user(sequelize, DataTypes);
