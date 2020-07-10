module.exports = function(sequelize, DataType){
  return sequelize.define("order", {
    id: {
      type: DataType.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    name: {
      type: DataType.STRING,
      allowNull: false
    },
    email: {
      type: DataType.STRING,
      allowNull: false
    },
    size: {
      type: DataType.STRING,
      allowNull: false
    },
    town: {
      type: DataType.STRING,
      allowNull: false
    },
    date: {
      type: DataType.STRING,
      allowNull: false
    },
    time: {
      type: DataType.STRING,
      allowNull: false
    },
    masterId: {
      type: DataType.INTEGER.UNSIGNED,
      allowNull: false
    },
    endTime: {
      type: DataType.STRING,
      allowNull: false
    }
  });
}
