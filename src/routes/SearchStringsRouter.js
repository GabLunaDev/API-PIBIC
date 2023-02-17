const express = require("express");
const routes = express.Router();

const SearchStringsController = require("../controllers/SearchStringsController");
const AuthMiddleware = require("../middleware/AuthMiddleware");

route.use("/search_strings", AuthMiddleware);
route.get("/search_strings", SearchStringsController.showAll)
route.post("/search_strings", SearchStringsController.create)
route.get("/search_strings/:id", SearchStringsController.showOne)
route.put("/search_strings/:id", SearchStringsController.update)


module.exports = routes