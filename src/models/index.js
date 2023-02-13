const sequelize = require("../config/sequelize");

const models = {};

for (const key in models) {
  models[key].associate(models);
}

sequelize.sync({ force: false });

module.exports = models;