const { Op } = require("sequelize");
const review = require("../models/review");
const user = require("../models/review");
const dbConnection = require("../config/sequelize");
const { logQuery } = require("../utils/common");
const Logging = require("../utils/logging");
const article = require("../models/article");

function includeAnArticle(firstReview, secondReview) {
  let sum = 0;

  if (firstReview === "Positiva") {
    sum++;
  }
  if (firstReview === "Negativa") {
    sum--;
  }

  if (secondReview === "Positiva") {
    sum++;
  }
  if (secondReview === "Negativa") {
    sum--;
  }

  return sum;
}

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
    const { finished, rating, article_id } = req.query

    try {
      let reviewWhereStatement = {}

      if(finished){
        reviewWhereStatement["finished"] = finished
      }

      if(rating){
        reviewWhereStatement["rating"] = rating
      }

      if(article_id){
        reviewWhereStatement["article_id"] = article_id
      }

      const reviewsData = await review.findAll({
        logging: (log, queryObject) => {
          logQuery(log, queryObject);
        },
        where: reviewWhereStatement,
        include: [
          {
            model: review,
            as: "solicited_through",
          },
        ],
      });

      return res.status(200).send(reviewsData);
    } catch (error) {
      Logging.error(error);
      return res.status(500).send({ message: "Internal Server Error" });
    }
  },
  async showOne(req, res, next) {
    const reviewId = req.params.id;

    try {
      const reviewData = await review.findOne({
        logging: (log, queryObject) => {
          logQuery(log, queryObject);
        },
        where: {
          id: reviewId,
        },
        include: [
          {
            model: review,
            as: "solicited_through",
          },
        ],
      });

      if (!reviewData) {
        return res.status(404).send({ message: "no reviews found" });
      }

      res.status(200).send(reviewData);
    } catch (error) {
      Logging.error(error);
      return res.status(500).send({ message: "Internal Server Error " });
    }
  },
  async nextReview(req, res, next) {
    const reviewId = req.params.id;
    const userData = req.auth;
    const { report, rating, next_reviewer_id } = req.body;

    try {
      let articleBodyStatement = {
        already_validated: true,
        validated_by: userData.id,
      };

      if (!report) {
        return res
          .status(400)
          .send({ message: "you can't review without a report" });
      }

      if (!rating) {
        return res
          .status(400)
          .send({ message: "you can't review without a rating" });
      }

      await dbConnection.transaction(async (t) => {
        const reviewData = await review.findOne({
          logging: (log, queryObject) => {
            logQuery(log, queryObject);
          },
          where: {
            id: reviewId,
          },
          include: [
            {
              model: review,
              as: "solicited_through",
            },
          ],
          transaction: t,
        });

        if (!reviewData) {
          return res.status(404).send({ message: "no reviews found " });
        }

        const reviewUpdateBody = {
          rating,
          report,
          finished: true,
        };

        if (next_reviewer_id) {
          await reviewData.update(reviewUpdateBody, {
            logging: (log, queryObject) => {
              logQuery(log, queryObject);
            },
            transaction: t,
          });

          const articleData = await article.findOne({
            logging: (log, queryObject) => {
              logQuery(log, queryObject);
            },
            transaction: t,
            where: {
              id: reviewData.article_id
            }
          })

          await review.create(
            {
              review_id: reviewData.id,
              article_id: reviewData.article_id,
              reviewer_id: next_reviewer_id,
            },
            {
              logging: (log, queryObject) => {
                logQuery(log, queryObject);
              },
              transaction: t,
            }
          );

          sendMessageToReviewer(next_reviewer_id, articleData.name, articleData.number);

          return res.status(200).send({
            message:
              "successfully reviewed article by requesting a third reviewer",
          });
        }

        const reviewsValue = includeAnArticle(
          reviewData.solicited_through.rating,
          rating
        );

        if (reviewsValue >= 0 && reviewsValue <= 1) {
          return res.status(400).send({
            message: "you need to ask a third person to rate this article",
          });
        }

        if (reviewsValue >= 2) {
          articleBodyStatement["included"] = true;
        }

        if (reviewsValue <= -1) {
          articleBodyStatement["included"] = false;
        }

        const reviewedArticleData = await reviewData.update(reviewUpdateBody, {
          logging: (log, queryObject) => {
            logQuery(log, queryObject);
          },
          transaction: t,
        });

        const articleData = await article.findOne({
          logging: (log, queryObject) => {
            logQuery(log, queryObject);
          },
          transaction: t,
          where: {
            id: reviewedArticleData.article_id,
          },
        });

        await articleData.update(articleBodyStatement, {
          logging: (log, queryObject) => {
            logQuery(log, queryObject);
          },
          transaction: t,
        });

        return res.status(200).send({
          message: "article successfully evaluated",
        });
      });
    } catch (error) {
      Logging.error(error);
      return res.status(500).send({ message: "Internal Server Error " });
    }
  },
  async update(req, res, next) {
    const reviewId = req.params.id;
    const body = req.body;

    try {
      const reviewData = await review.findOne({
        logging: (log, queryObject) => {
          logQuery(log, queryObject);
        },
        where: {
          id: reviewId,
        },
      });

      if (!reviewData) {
        return res.status(404).send({ message: "no reviews found" });
      }

      await reviewData.update(body, {
        logging: (log, queryObject) => {
          logQuery(log, queryObject);
        },
      });

      res.status(200).send({ message: "review updated with success" });
    } catch (error) {
      Logging.error(error);
      return res.status(500).send({ message: "Internal Server Error " });
    }
  },
};
