const express = require("express");
const routes = express.Router();

const routesList = {

}

for(const router in routesList){
    routes.use(routesList[router]);
}

module.exports = routes;