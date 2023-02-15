const express = require("express");
const routes = require("./routes");
const Logging = require("./utils/logging");
const serverless = require("serverless-http");

const dotenv = require("dotenv/config");
const { sequelize } = require("./models");

const app = express();

const { logMiddleware } = require("./middleware/LogMiddleware");

try {
  app.use(logMiddleware);
  app.use(express.json());
  app.use("/api", routes);

  app.use(express.urlencoded({ extended: true }));
  app.listen(process.env.PORT || 5000, () => {
    Logging.info(`Server started at port ${process.env.PORT || 5000}`);
  });

  module.exports.handler = serverless(app);
} catch (error) {
  Logging.error(error);
}
