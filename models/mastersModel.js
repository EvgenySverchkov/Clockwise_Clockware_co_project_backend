module.exports = function(sequelize, DataType){
  return sequelize.define("master", {
    id: {
      type: DataType.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
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