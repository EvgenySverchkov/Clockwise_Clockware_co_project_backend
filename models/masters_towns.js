const configDB = require("../config/sequelizeConfig");

const mastersModel = function (sequelize, DataType) {
  return sequelize.define("masters_town", {});
};

module.exports = mastersModel(configDB.connectOption, configDB.dataType);
