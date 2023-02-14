const sequelize = require("../config/sequelize");
const { DataTypes } = require("sequelize");

const search_strings = (sequelize, DataTypes) => {
  const search_strings = sequelize.define(
    "search_strings",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        unique: true,
      },
      number: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        comment: "sequencial number of the search_strings",
      },
      group: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      string: {
        type: DataTypes.STRING(2000),
        allowNull: false
      },
      search_engine: {
        type: DataTypes.ENUM(["ACM", "PubMed", "IEEE"]),
        allowNull: false
      },
      result: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    { freezeTableName: true }
  );

  search_strings.associate = function (models) {
    models.search_strings.belongsTo(models.user, {
        foreignKey: {
            name: "added_by"
        }
    })
  };
  return search_strings;
};
module.exports = search_strings(sequelize, DataTypes);
