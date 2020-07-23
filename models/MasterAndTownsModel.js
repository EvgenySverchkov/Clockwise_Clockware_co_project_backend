const configDB = require("../config/sequelizeConfig");

const mastersAndTownsModel = function (sequelize, DataType) {
  return sequelize.define("townandmasters", {
    id: {
      type: DataType.INTEGER.UNSIGNED,
      primaryKey: true,
      allowNull: false,
      defaultValue: null,
      autoIncrement: true,
    },
    masterId: {
        type: DataType.INTEGER.UNSIGNED,
        allowNull: false,
    },
    townId: {
        type: DataType.INTEGER.UNSIGNED,
        allowNull: false,
    },
  });
};

module.exports = mastersAndTownsModel(configDB.connectOption, configDB.dataType);
