const Sequelize = require("sequelize");
const Op = Sequelize.Op;

const operatorsAliases = {
  $like: Op.like,
  $or: Op.or,
  $gte: Op.gte,
  $in: Op.in,
};
let sequelize;

const isLogging = !(process.env.NODE_ENV === 'test');
sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
  dialect: process.env.DB_DIALECT,
  host: process.env.DB_HOST,
  define: {
    timestamps: false,
  },
  sync: { force: true },
  operatorsAliases,
  logging: isLogging
});


module.exports = {
  dataType: Sequelize,
  connectOption: sequelize,
};
