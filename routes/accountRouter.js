const express = require("express");
const accRouter = express.Router();

const accountController = require("../controllers/accountController");

accRouter.post("/login", accountController.login);
accRouter.post("/signUp", accountController.signUp);
accRouter.post("/adminLogin", accountController.adminLogin);
module.exports = accRouter;
