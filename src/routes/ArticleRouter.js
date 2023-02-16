const express = require("express");
const routes = express.Router();

const ArticleController = require("../controllers/ArticleController");
const AuthMiddleware = require("../middleware/AuthMiddleware");

routes.use("/article", AuthMiddleware);
routes.get("/article", ArticleController.showAll);
routes.get("/article/:id", ArticleController.showOne);
routes.post("/article", ArticleController.create);
routes.put("/article/:id", ArticleController.update);

module.exports = routes;
