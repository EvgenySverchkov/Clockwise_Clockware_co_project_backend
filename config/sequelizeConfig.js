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
if (process.env.CLEARDB_DATABASE_URL) {
  sequelize = new Sequelize(
    "heroku_c647561c828c05a",
    "b9d382caa58e34",
    "429f0925",
    {
      dialect: "mysql",
      host: "us-cdbr-east-05.cleardb.net",
      define: {
        timestamps: false,
      },
      operatorsAliases,
      logging: isLogging
    }
  );
} else {
  sequelize = new Sequelize("local_db", "root", "root", {
    dialect: "mysql",
    host: "127.0.0.1",
    define: {
      timestamps: false,
    },
    sync: { force: true },
    operatorsAliases,
    logging: isLogging
  });
}

module.exports = {
  dataType: Sequelize,
  connectOption: sequelize,
};
