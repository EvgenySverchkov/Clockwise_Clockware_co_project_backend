const express = require("express");
const townsRouter = express.Router();
const townsController = require("../controllers/townsController");

townsRouter.get("/", townsController.index);
townsRouter.post("/post", townsController.add);
townsRouter.put("/put/:id", townsController.edit);
townsRouter.delete("/delete/:id", townsController.delete);

module.exports = townsRouter;
