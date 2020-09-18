const configDB = require("../db/init");

const mastersModel = function (sequelize, DataType) {
  return sequelize.define("masters_town", {});
};

module.exports = mastersModel(configDB.connectOption, configDB.dataType);
