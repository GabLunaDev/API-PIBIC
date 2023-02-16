const sequelize = require("../config/sequelize");
const { DataTypes } = require("sequelize");

const review = (sequelize, DataTypes) => {
  const Review = sequelize.define(
    "review",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        unique: true,
      },
      finished: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      report: {
        type: DataTypes.STRING(1000)
      },
      rating: {
        type: DataTypes.ENUM(["Positiva", "Negativa", "Não tem certeza"]),
      }
    },
    { freezeTableName: true }
  );

  Review.associate = function (models) {
    models.review.belongsTo(models.article, {
        foreignKey: {
            name: "article_id"
        }
    })
    models.review.belongsTo(models.review, {
      as: "solicited_through",
      foreignKey: {
        name: "review_id"
      }
    })
    models.review.belongsTo(models.user, {
        allowNull: false,
        foreignKey: {
            name: "reviewer_id"
        }
    })
  };
  return Review;
};
module.exports = review(sequelize, DataTypes);
