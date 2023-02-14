const sequelize = require("../config/sequelize");

const user = require("./user");
const article = require("./article");
const review = require("./review");
const search_strings = require("./search_strings")

const models = {
  user,
  article,
  review,
  search_strings
};

for (const key in models) {
  models[key].associate(models);
}

sequelize.sync({ force: false });

module.exports = models;