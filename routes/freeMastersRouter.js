const express = require("express");
const freeMastersRouter = express.Router();
const freeMastersController = require("../controllers/freeMastersController");

freeMastersRouter.post("/", freeMastersController.index);

module.exports = freeMastersRouter;
