const express = require("express");
const mastersRouter = express.Router();
const mastersController = require("../controllers/mastersController");

mastersRouter.get("/", mastersController.getMasters);
mastersRouter.post("/post", mastersController.postMaster);
mastersRouter.put("/put/:id", mastersController.putMaster);
mastersRouter.delete("/delete/:id", mastersController.deleteMaster);

module.exports = mastersRouter;
