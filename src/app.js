const express = require("express");
const routes = require("./routes");
const Logging = require("./utils/logging");
const cors = require("cors");

const dotenv = require("dotenv/config");
const { sequelize } = require("./models");

const app = express();

const { logMiddleware } = require("./middleware/LogMiddleware");

try {
  app.use(logMiddleware);

  app.use(cors);
  app.use(express.json);
  app.use("/api", routes);

  app.listen(process.env.PORT || 5000, () => {
    Logging.info(`Server started at port ${process.env.PORT || 5000}`);
  });
} catch (error) {
  Logging.error(error);
}
