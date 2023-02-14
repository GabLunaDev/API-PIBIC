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
        defaultValue: true
      },
      first_report: {
        type: DataTypes.STRING(1000),
        allowNull: false
      },
      second_report: {
        type: DataTypes.STRING(1000),
        allowNull: false
      },
      third_report: {
        type: DataTypes.STRING(1000),
        allowNull: false
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
    models.review.belongsTo(models.user, {
        foreignKey: {
            name: "first_reviewer"
        }
    })
    models.review.belongsTo(models.user, {
        foreignKey: {
            name: "second_reviewer"
        }
    })
    models.review.belongsTo(models.user, {
        foreignKey: {
            name: "third_reviewer"
        }
    })
  };
  return Review;
};
module.exports = review(sequelize, DataTypes);
