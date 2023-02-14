const express = require("express");
const routes = express.Router();

const LoginController = require("../controllers/LoginController")

routes.post("/login", LoginController.tryLogin)

module.exports = routes