const search_strings = require("../models/search_strings");
const logging = require("../utils/logging");

module.exports = {
  async create(req, res, next) {
    const body = req.body;
    const userData = req.auth;

    try {
      body.added_by = userData.id;

      if (!body.group) {
        return res.status(400).send({ message: "Cannot create without group" });
      }

      if (!body.string) {
        return res
          .status(400)
          .send({ message: "Cannot create without the string" });
      }

      if (!body.search_engine) {
        return res
          .status(400)
          .send({ message: "Cannot create without the search_engine" });
      }

      if (!body.result) {
        return res
          .status(400)
          .send({ message: "Cannot create without the string" });
      }

      const searchStringData = await search_strings.create(body, {
        logging: (log, queryObject) => {
          logQuery(log, queryObject);
        },
      });

      return res
        .status(201)
        .send({ message: "Search String Created With Success!" });
    } catch (error) {
      logging.error(error);
      return res.status(500).send({ message: "Internal Server Error" });
    }
  },
  async showAll(req, res, next) {
    try {
      const searchStringsData = await search_strings.findAll({
        logging: (log, queryObject) => {
          logQuery(log, queryObject);
        },
      });

      return res.status(201).send(searchStringsData);
    } catch (error) {
      logging.error(error);
      return res.status(500).send({ message: "Internal Server Error" });
    }
  },
  async showOne(req, res, next) {
    const searchStringId = req.params.id;
    try {
      const searchStringData = await search_strings.findOne({
        logging: (log, queryObject) => {
          logQuery(log, queryObject);
        },
        where: {
          id: searchStringId,
        },
      });

      if (!searchStringData) {
        return res.status(404).send({ message: "no search string found" });
      }

      return res.status(200).send(searchStringData);
    } catch (error) {
      logging.error(error);
      return res.status(500).send({ message: "Internal Server Error" });
    }
  },
  async update(req, res, next) {
    const searchStringId = req.params.id;
    const body = req.body;

    try {
      if (!body) {
        return res.status(404).send({ message: "no body found" });
      }

      const searchStringData = await search_strings.findOne({
        logging: (log, queryObject) => {
          logQuery(log, queryObject);
        },
        where: {
          id: searchStringId,
        },
      });

      if (!searchStringData) {
        return res.status(404).send({ message: "no search string found" });
      }

      await searchStringData.update(body, {
        logging: (log, queryObject) => {
          logQuery(log, queryObject);
        },
      });

      return res
        .status(200)
        .send({ message: "search string updated with success" });
    } catch (error) {
      Logging.error(error);
      return res.status(500).send({ message: "Internal Server Error" });
    }
  },
};
