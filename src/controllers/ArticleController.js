const article = require("../models/article");
const user = require("../models/user");
const { logQuery } = require("../utils/common");
const { Op } = require("sequelize");
const dbConnection = require("../config/sequelize");
const Logging = require("../utils/logging");
const review = require("../models/review");

module.exports = {
  async create(req, res, next) {
    const {
      name,
      year,
      language,
      page,
      search_engine,
      link,
      reviews,
      next_reviewer_id,
    } = req.body;
    const userData = req.auth;
    const created_by = userData.id;

    try {
      if (!name) {
        return res
          .status(400)
          .send({ message: "You can't create without the name" });
      }

      await dbConnection.transaction(async (t) => {
        const articleAlreadyExists = await article.findOne({
          logging: (log, queryObject) => {
            logQuery(log, queryObject);
          },
          transaction: t,
          where: {
            name: {
              [Op.iLike]: `${name}%`,
            },
          },
        });

        let body = {
          name,
          year,
          language,
          page,
          search_engine,
          link,
          created_by,
        };

        if (reviews) {
          await reviews.map(async (valueObject) => {
            return (valueObject["reviewer_id"] = userData.id);
          });

          body.reviews = reviews;
        }

        if (articleAlreadyExists) {
          return res
            .status(400)
            .send({ message: "An article with this name already exists" });
        }

        const articleData = await article.create(body, {
          logging: (log, queryObject) => {
            logQuery(log, queryObject);
          },
          transaction: t,
          include: [
            {
              association: article.associations.reviews,
            },
          ],
        });

        await review.create(
          {
            review_id: articleData.reviews[0].id,
            article_id: articleData.id,
            reviewer_id: next_reviewer_id,
          },
          {
            logging: (log, queryObject) => {
              logQuery(log, queryObject);
            },
            transaction: t,
          }
        );
      });

      return res.status(201).send({ message: "Article created with success" });
    } catch (error) {
      Logging.error(error);
      return res.status(500).send({ message: "Internal Server Error" });
    }
  },

  async showAll(req, res, next) {
    const { number, included, already_validated, name, search_engine, created_by } = req.query

    try {
      let articleWhereStatement = {}

      if(number){
        articleWhereStatement["number"] = number
      }

      if(included){
        articleWhereStatement["included"] = included
      }

      if(already_validated){
        articleWhereStatement["already_validated"] = already_validated
      }

      if(name){
        articleWhereStatement["name"] = {
          [Op.iLike]: `${name}%`,
        }
      }
      
      if(search_engine){
        articleWhereStatement["search_engine"] = [search_engine]
      }

      const articleData = await article.findAll({
        logging: (log, queryObject) => {
          logQuery(log, queryObject);
        },
        where: articleWhereStatement,
        attributes: {
          exclude: ["created_by"],
        },
        include: [
          {
            model: user,
            as: "inserted_by",
            attributes: ["id", "name", "username"],
          },
        ],
      });

      if (!articleData.length > 0) {
        return res.status(404).send({ message: "no articles found" });
      }

      return res.status(200).send(articleData);
    } catch (error) {
      Logging.error(error);
      return res.status(500).send({ message: "Internal Server Error" });
    }
  },

  async showOne(req, res, next) {
    const articleId = req.params.id;

    try {
      const articleData = await article.findOne({
        logging: (log, queryObject) => {
          logQuery(log, queryObject);
        },
        where: {
          id: articleId,
        },
      });

      if (!articleData) {
        return res.status(404).send({ message: "no article found" });
      }

      return res.status(200).send(articleData);
    } catch (error) {
      Logging.error(error);
      return res.status(500).send({ message: "Internal Server Error" });
    }
  },

  async update(req, res, next) {
    const articleId = req.params.id;
    const body = req.body;

    try {
      if (!body) {
        return res.status(404).send({ message: "no body found" });
      }

      const articleData = await article.findOne({
        logging: (log, queryObject) => {
          logQuery(log, queryObject);
        },
        where: {
          id: articleId,
        },
      });

      if (!articleData) {
        return res.status(404).send({ message: "no article found" });
      }

      await articleData.update(body, {
        logging: (log, queryObject) => {
          logQuery(log, queryObject);
        },
      });

      return res.status(200).send({ message: "article updated with success" });
    } catch (error) {
      Logging.error(error);
      return res.status(500).send({ message: "Internal Server Error" });
    }
  },
};
