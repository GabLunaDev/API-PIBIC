const express = require("express");
const routes = express.Router();

const SearchStringsController = require("../controllers/SearchStringsController");
const AuthMiddleware = require("../middleware/AuthMiddleware");

routes.use("/search-strings", AuthMiddleware);
routes.get("/search-strings", SearchStringsController.showAll)
routes.post("/search-strings", SearchStringsController.create)
routes.get("/search-strings/:id", SearchStringsController.showOne)
routes.put("/search-strings/:id/update", SearchStringsController.update)


module.exports = routes