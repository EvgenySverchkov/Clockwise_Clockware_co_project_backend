const configDB = require("../db/init");

const mastersModel = function (sequelize, DataType) {
  return sequelize.define("master", {
    id: {
      type: DataType.INTEGER.UNSIGNED,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    rating: {
      type: DataType.INTEGER.UNSIGNED,
      allowNull: false,
    },
    name: {
      type: DataType.STRING,
      allowNull: false,
    },
  });
};

module.exports = mastersModel(configDB.connectOption, configDB.dataType);
