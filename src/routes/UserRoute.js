const express = require("express");
const routes = express.Router();

const UserController = require("../controllers/UserController");

routes.post("/user", UserController.create);
routes.get("/user", UserController.showAll);
routes.get("/user/:id", UserController.showOne);
routes.put("/user/:id", UserController.update);

module.exports = routes;