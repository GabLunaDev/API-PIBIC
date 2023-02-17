const express = require("express");
const routes = require("./routes");
const Logging = require("./utils/logging");
const cors = require("cors")

const dotenv = require("dotenv/config");
const { sequelize } = require("./models");

const app = express();

const { logMiddleware } = require("./middleware/LogMiddleware");

try {
  app.use(logMiddleware);
  app.use(express.json());

  const corsOptions = {
    origin: function (origin, callback) {
      if (!origin || whitelist.indexOf(origin) !== -1) {
        callback(null, true)
      } else {
        callback(new Error("Not allowed by CORS"))
      }
    },
    credentials: true,
  }
  
  app.use(cors(corsOptions));

  app.use("/api", routes);

  app.use(express.urlencoded({ extended: true }));
  app.listen(process.env.PORT || 5000, () => {
    Logging.info(`Server started at port ${process.env.PORT || 5000}`);
  });
} catch (error) {
  Logging.error(error);
}
