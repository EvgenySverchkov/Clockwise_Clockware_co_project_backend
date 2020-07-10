const express = require("express");
const mailerRouter = express.Router();
const mailerController = require("../controllers/mailerController");

mailerRouter.post('/send_message', mailerController.sendMessage);

module.exports = mailerRouter;
