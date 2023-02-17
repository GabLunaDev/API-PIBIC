const user = require("../models/user");
const { logQuery } = require("../utils/common");
const Logging = require("../utils/logging");
const argon2 = require("argon2");

module.exports = {
  async create(req, res, next) {
    try {
      const body = req.body;

      if (!body) {
        return res.status(400).send({ message: "the body is empty" });
      }

      if (!body.name) {
        return res
          .status(400)
          .send({ message: "cannot create without a name" });
      }

      if (!body.username) {
        return res
          .status(400)
          .send({ message: "cannot create without a username" });
      }

      if (!body.password) {
        return res
          .status(400)
          .send({ message: "cannot create without a password" });
      }

      const usernameAlreadyExists = await user.findOne({
        logging: (log, queryObject) => {
          logQuery(log, queryObject);
        },
        where: {
          username: body.username,
        },
      });

      if (usernameAlreadyExists) {
        return res.status(400).send({ message: "this username already exist" });
      }

      body.password = await argon2.hash(body.password);

      await user.create(body, {
        logging: (log, queryObject) => {
          logQuery(log, queryObject);
        },
      });

      res.status(201).send({ message: "User created with success" });
    } catch (error) {
      Logging.error(error);
      res.status(500).send({ message: "Internal Server Error!" });
    }
  },
  async showAll(req, res, next) {
    try {
      const usersData = await user.findAll({
        logging: (log, queryObject) => {
          logQuery(log, queryObject);
        },
        attributes: {
          exclude: ["password"],
        },
      });

      if (!usersData) {
        res.status(404).send({ message: "no users found" });
      }

      res.status(200).send(usersData);
    } catch (error) {
      Logging.error(error);
      res.status(500).send({ message: "Internal Server Error!" });
    }
  },
  async showOne(req, res, next) {
    const userId = req.params.id;

    try {
      const userData = await user.findOne({
        logging: (log, queryObject) => {
          logQuery(log, queryObject);
        },
        where: {
          id: userId,
        },
        attributes: {
          exclude: ["password"],
        },
      });

      if (!userData) {
        res.status(404).send({ message: "no user found" });
      }

      return res.status(200).send(userData);
    } catch (error) {
      Logging.error(error);
      res.status(500).send({ message: "Internal Server Error!" });
    }
  },
  async update(req, res, next) {
    const userId = req.params.id;
    const body = req.body;
    try {
      if (!body) {
        res.status(400).send({ message: "no body found" });
      }

      const userData = await user.findOne({
        logging: (log, queryObject) => {
          logQuery(log, queryObject);
        },
        where: {
          id: userId,
        },
      });

      if (!userData) {
        res.status(404).send({ message: "no user found" });
      }

      await userData.update(
        {
          name: body.name,
          username: body.username,
        },
        {
          logging: (log, queryObject) => {
            logQuery(log, queryObject);
          },
        }
      );

      return res.status(200).send({ message: "success update" });
    } catch (error) {
      Logging.error(error);
      res.status(500).send({ message: "Internal Server Error!" });
    }
  },
};
