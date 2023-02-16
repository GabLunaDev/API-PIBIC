const { Op } = require("sequelize");
const review = require("../models/review");
const user = require("../models/review");
const { logQuery } = require("../utils/common");
const Logging = require("../utils/logging");

module.exports = {
  async create(req, res, next) {
    const body = req.body;
    try {
      const reviewerAlreadyMadeAReviewOfThisArticle = await review.findAll({
        logging: (log, queryObject) => {
          logQuery(log, queryObject);
        },
        where: {
          [Op.and]: [
            { reviewer_id: body.reviewer_id },
            { article_id: body.article_id },
          ],
        },
      });

      if (reviewerAlreadyMadeAReviewOfThisArticle.length > 0) {
        return res.status(400).send({
          message: "The reviewer already did a review with this article",
        });
      }

      await review.create(body, {
        logging: (log, queryObject) => {
          logQuery(log, queryObject);
        },
      });

      return res.status(201).send({ message: "Review Created With Success" });
    } catch (error) {
      Logging.error(error);
      return res.status(500).send({ message: "Internal Server Error" });
    }
  },
  async showAll(req, res, next) {
    try {
        const reviewsData = await review.findAll({
            logging: (log, queryObject) => {
                logQuery(log, queryObject);
            },
            include: [
              {
                model: review,
                as: "solicited_through",
              }
            ]
        })

        return res.status(200).send(reviewsData)
    } catch (error) {
      Logging.error(error);
      return res.status(500).send({ message: "Internal Server Error" });
    }
  },
  async showOne(req, res, next) {},
  async update(req, res, next) {},
};
