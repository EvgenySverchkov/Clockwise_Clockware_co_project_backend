const Sequelize = require("sequelize");
const sequelize = new Sequelize("heroku_c647561c828c05a", "b9d382caa58e34", "429f0925", {
  dialect: "mysql",
  host: "us-cdbr-east-05.cleardb.net",
  define: {
    timestamps: false
  }
});

module.exports = {
  dataType: Sequelize,
  connectOption: sequelize
}
