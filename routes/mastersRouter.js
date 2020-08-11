const express = require("express");
const mastersRouter = express.Router();
const mastersController = require("../controllers/mastersController");
const passport = require("passport");

mastersRouter.post("/", mastersController.index);
mastersRouter.post("/post", mastersController.add);
mastersRouter.put("/put/:id", mastersController.edit);
mastersRouter.delete("/delete/:id", mastersController.delete);

module.exports = mastersRouter;
