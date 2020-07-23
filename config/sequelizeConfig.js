const Sequelize = require("sequelize");
const Op = Sequelize.Op;

const operatorsAliases = {
  $like: Op.like,
  $or: Op.or,
  $lt: Op.lt
}
let sequelize
if(process.env.CLEARDB_DATABASE_URL){
  sequelize = new Sequelize("heroku_c647561c828c05a", "b9d382caa58e34", "429f0925", {
    dialect: "mysql",
    host: "us-cdbr-east-05.cleardb.net",
    define: {
      timestamps: false
    },
    operatorsAliases
  });
}else{
  sequelize = new Sequelize("local_db", "root", "root", {
    dialect: "mysql",
    host: '127.0.0.1',
    define: {
      timestamps: false
    },
    sync: { force: true },
    operatorsAliases,
  });
}

module.exports = {
  dataType: Sequelize,
  connectOption: sequelize
}
