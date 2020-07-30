const Order = require("../models/ordersModel");
const Town = require("../models/townsModel");

class OrdersController {
  constructor(model, townModel) {
    this.model = model;
    this.townModel = townModel;
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
    for (let key in req.body) {
      if (!req.body[key]) {
        res.status(400).send({ success: false, msg: "Filling all gaps!!" });
        return false;
      }
      
      if(key == 'name'){
        if(req.body[key].length <= 3){
          res.status(400).send({ success: false, msg: "Name must be at least 3 characters" });
          return false;
        }
      }
    }
    this.townModel
      .findOne({ where: { name: req.body.town } })
      .then((data) => {
        if (!data) {
          return Promise.reject({ status: 400, msg: "Town not found" });
        } else {
          return this.model.create({ ...req.body, townId: data.dataValues.id });
        }
      })
      .then((data) => {
        res.send({ success: true, msg: "You added order", payload: data });
      })
      .catch((err) =>
        res.status(err.status || 500).send({ success: false, msg: err })
      );
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
        res
          .status(200)
          .send({ success: true, msg: "You update order", payload: data })
      )
      .catch((err) => res.status(500).send({ success: false, msg: err }));
  }
  delete(req, res) {
    this.model
      .findOne({ where: { id: req.params.id } })
      .then((result) => {
        if (result) {
          return this.model.destroy({
            where: {
              id: req.params.id,
            },
          });
        } else {
          res.status(400).send({
            success: false,
            msg: `Order with id: ${req.params.id} not found`,
          });
        }
      })
      .then((data) =>
        res.status(200).send({
          success: true,
          msg: "You deleted order",
          payload: +req.params.id,
        })
      )
      .catch((err) => res.status(500).send({ success: false, msg: err }));
  }
}

module.exports = new OrdersController(Order, Town);
