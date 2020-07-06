const express = require("express");
const townsRouter = express.Router();
const townsController = require("../controllers/townsController");

townsRouter.get("/", townsController.getTowns);
townsRouter.post("/post", townsController.postTown);
townsRouter.put("/put/:id", townsController.putTown);
townsRouter.delete("/delete/:id", townsController.deleteTown);

module.exports = townsRouter;
