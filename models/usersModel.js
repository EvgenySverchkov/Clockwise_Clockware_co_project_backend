const configDB = require("../config/sequelizeConfig");

const usersModel = function (sequelize, DataType) {
  return sequelize.define("user", {
    id: {
      type: DataType.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataType.STRING,
      allowNull: false,
    },
    email: {
      type: DataType.STRING,
      allowNull: false,
    },
    password: {
      type: DataType.STRING,
      allowNull: false,
    },
    role: {
      type: DataType.STRING,
      allowNull: false,
    },
  });
};

module.exports = usersModel(configDB.connectOption, configDB.dataType);
