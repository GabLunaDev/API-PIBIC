const sequelize = require("../config/sequelize");

const user = require("./user");
const article = require("./article");
const review = require("./review");

const models = {
  user,
  article,
  review
};

for (const key in models) {
  models[key].associate(models);
}

sequelize.sync({ force: false });

module.exports = models;