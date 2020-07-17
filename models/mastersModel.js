const configDB = require('../config/sequelizeConfig');

const mastersModel = function(sequelize, DataType){
  return sequelize.define("master", {
    id: {
      type: DataType.INTEGER.UNSIGNED,
      primaryKey: true,
      allowNull: false,
      defaultValue: null,
      autoIncrement: true
    },
    rating: {
      type: DataType.INTEGER.UNSIGNED,
      allowNull: false
    },
    towns: {
      type: DataType.STRING,
      allowNull: false
    },
    name: {
      type: DataType.STRING,
      allowNull: false
    }
  });
}

module.exports = mastersModel(configDB.connectOption, configDB.dataType);
