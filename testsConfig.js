const {connectOption} = require("./config/sequelizeConfig");
afterAll(()=>connectOption.close())