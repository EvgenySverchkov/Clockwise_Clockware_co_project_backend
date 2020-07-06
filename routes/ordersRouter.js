const express = require("express");
const ordersRouter = express.Router();
const ordersController = require("../controllers/ordersController");

ordersRouter.get("/", ordersController.getOrders);
ordersRouter.post("/post", ordersController.postOrder);
ordersRouter.put("/put/:id", ordersController.putOrder);
ordersRouter.delete("/delete/:id", ordersController.deleteOrder);

module.exports = ordersRouter;
