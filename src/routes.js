const express = require("express");
const routes = express.Router();

const UserRouter = require("./routes/UserRouter")
const ArticleRouter = require("./routes/ArticleRouter")
const LoginRouter = require("./routes/LoginRouter")

const routesList = {
    UserRouter,
    ArticleRouter,
    LoginRouter
}

for(const router in routesList){
    routes.use(routesList[router]);
}

module.exports = routes;