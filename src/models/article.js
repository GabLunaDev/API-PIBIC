const sequelize = require("../config/sequelize");
const { DataTypes } = require("sequelize");

const article = (sequelize, DataTypes) => {
  const Article = sequelize.define(
    "article",
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
        comment: "sequencial number of the article",
      },
      already_validated: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: "if the paper was validated by the protocol",
      },
      included: {
        type: DataTypes.BOOLEAN,
        comment: "if the paper will be included",
      },
      name: {
        type: DataTypes.STRING(500),
        allowNull: false,
        comment: "paper name",
      },
      year: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: "year of the paper",
      },
      language: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: "paper's language",
      },
      page: {
        type: DataTypes.INTEGER,
        comment: "how much pages is the paper",
      },
      search_engine: {
        type: DataTypes.ARRAY(DataTypes.ENUM(["ACM", "PubMed", "IEEE"])),
        allowNull: false,
        comment: "what is the search engine the article is avaliable",
      },
      link: {
        type: DataTypes.STRING(500),
        allowNull: false,
        comment: "article's link",
      },
    },
    { freezeTableName: true }
  );

  Article.associate = function (models) {
    models.article.belongsTo(models.user, {
      foreignKey: {
        name: "added_by",
      },
    });
    models.article.belongsTo(models.user, {
      foreignKey: {
        name: "validated_by",
      },
    });
  };
  return Article;
};
module.exports = article(sequelize, DataTypes);
