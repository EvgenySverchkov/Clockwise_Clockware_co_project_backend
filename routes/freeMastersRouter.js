const express = require("express");
const freeMastersRouter = express.Router();
const freeMastersController = require("../controllers/freeMastersController");

freeMastersRouter.get('/:infoObj', freeMastersController.index);

module.exports = freeMastersRouter;
