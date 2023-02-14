const express = require("express");
const routes = express.Router();

const ArticleController = require("../controllers/ArticleController")
const AuthMiddleware = require("../middleware/AuthMiddleware")

routes.get("/article", AuthMiddleware, ArticleController.showAll)
routes.get("/article/:id", AuthMiddleware, ArticleController.showOne)
routes.post("/article", AuthMiddleware, ArticleController.create)
routes.put("/article/:id", AuthMiddleware, ArticleController.update)

module.exports = routes