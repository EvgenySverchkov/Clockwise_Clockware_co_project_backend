module.exports = function(sequelize, DataType){
  return sequelize.define("townsname", {
    id: {
      type: DataType.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    name: {
      type: DataType.STRING,
      allowNull: false
    }
  });
}
