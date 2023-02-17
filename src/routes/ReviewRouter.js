const express = require("express");
const routes = express.Router();

const ReviewController = require("../controllers/ReviewController");
const AuthMiddleware = require("../middleware/AuthMiddleware");

routes.use("/review", AuthMiddleware);
routes.get("/review", ReviewController.showAll);
routes.post("/review", ReviewController.create);
routes.post("/review/:id/analysis", ReviewController.nextReview);
routes.get("/review/:id", ReviewController.showOne);
routes.put("/review/:id", ReviewController.update);

module.exports = routes

