const express = require("express");
const townsRouter = express.Router();
const townsController = require("../controllers/townsController");
const passport = require("passport");

townsRouter.get("/", passport.authenticate('jwt', {session: false}), townsController.index);
townsRouter.post("/post", townsController.add);
townsRouter.put("/put/:id", townsController.edit);
townsRouter.delete("/delete/:id", townsController.delete);

module.exports = townsRouter;
