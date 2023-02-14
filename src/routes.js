const express = require("express");
const routes = express.Router();

const UserRoute = require("./routes/UserRoute")

const routesList = {
    UserRoute
}

console.log("teste");

for(const router in routesList){
    routes.use(routesList[router]);
}

module.exports = routes;