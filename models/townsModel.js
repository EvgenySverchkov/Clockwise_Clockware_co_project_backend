const configDB = require("../config/sequelizeConfig");

const townsModel = function (sequelize, DataType) {
  return sequelize.define("townsname", {
    id: {
      type: DataType.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      // defaultValue: null,
    },
    name: {
      type: DataType.STRING,
      allowNull: false,
    },
  });
};

module.exports = townsModel(configDB.connectOption, configDB.dataType);
