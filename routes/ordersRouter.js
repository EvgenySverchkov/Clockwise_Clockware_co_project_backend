const express = require("express");
const ordersRouter = express.Router();
const ordersController = require("../controllers/ordersController");
const passport = require("passport");

ordersRouter.get("/", ordersController.index);
ordersRouter.post("/post", ordersController.add);
ordersRouter.post("/getUserOrders", ordersController.getUserOrders);
ordersRouter.put("/put/:id", ordersController.edit);
ordersRouter.delete("/delete/:id", ordersController.delete);

module.exports = ordersRouter;
