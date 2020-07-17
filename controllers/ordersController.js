const Order = require("../models/ordersModel.js");

class OrdersController {
  constructor(model) {
    this.model = model;
    this.index = this.index.bind(this);
    this.add = this.add.bind(this);
    this.edit = this.edit.bind(this);
    this.delete = this.delete.bind(this);
  }
  index(req, res) {
    this.model
      .findAll({ raw: true })
      .then((data) => res.send(data))
      .catch((err) => res.send(err));
  }
  add(req, res) {
    let infoObj = req.body;
    if (
      Object.keys(infoObj).length !== 8 ||
      Object.keys(infoObj).length === 0
    ) {
      res.status(400).send({ success: false, msg: "Filling all gaps!!" });
    } else {
      this.model
        .create(req.body)
        .then((data) =>
          res.send(
            res
              .status(200)
              .send({ success: true, msg: "You added order", payload: data })
          )
        )
        .catch((err) => {
          throw err;
        });
    }
  }
  edit(req, res) {
    for (let key in req.body) {
      if (!req.body[key]) {
        res.status(400).send({ success: false, msg: "Filling all gaps!!" });
        return false;
      }
    }
    this.model
      .update(req.body, {
        where: {
          id: req.params.id,
        },
      })
      .then((data) =>
        res.send(
          res
            .status(200)
            .send({ success: true, msg: "You update order", payload: data })
        )
      )
      .catch((err) => {
        throw err;
      });
  }
  delete(req, res) {
    this.model
      .findOne({
        where: {
          id: req.params.id,
        },
      })
      .then((result) => {
        if (result) {
          return this.model.destroy({
            where: {
              id: req.params.id,
            },
          });
        } else {
          res
            .status(400)
            .send({
              success: false,
              msg: `Order with id: ${req.params.id} not found`,
            });
        }
      })
      .then((data) =>
        res.send(
          res
            .status(200)
            .send({
              success: true,
              msg: "You deleted order",
              payload: +req.params.id,
            })
        )
      )
      .catch((err) => {
        throw err;
      });
  }
}

module.exports = new OrdersController(Order);
