const {connectOption} = require("../db/init");

afterAll(()=>connectOption.close())