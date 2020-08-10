const Sequelize = require("sequelize");
const sequelize = new Sequelize("local_db", "root", "root", {
  dialect: "mysql",
  host: '127.0.0.1',
  define: {
    timestamps: false
  },
  sync: { force: true },
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.master = require("./mastersModel");
db.town = require("./townsModel");

db.master.belongsToMany(db.town, {
  through: "master_town",
  as: "townsnames",
  foreignKey: "master_id",
});
db.town.belongsToMany(db.master, {
  through: "master_town",
  as: "masters",
  foreignKey: "townsname_id",
});

module.exports = db;
