const Order = require("../models/ordersModel");
const Town = require("../models/townsModel");
const Master = require("../models/mastersModel");
const validators = require("../helpers/validators");

class OrdersController {
  constructor(model, townModel, masterModel) {
    this.model = model;
    this.townModel = townModel;
    this.masterModel = masterModel;
    this.index = this.index.bind(this);
    this.add = this.add.bind(this);
    this.edit = this.edit.bind(this);
    this.delete = this.delete.bind(this);
    this.getUserOrders = this.getUserOrders.bind(this);
  }
  index(req, res) {
    return this.model
      .findAll({ raw: true })
      .then((data) => res.send(data))
      .catch((err) => res.send(err));
  }
  getUserOrders(req, res) {
    const infoObj = req.body;
    const validationResult = validators.getUserOrdersValidator(infoObj);
    if (!validationResult.success) {
      res.status(validationResult.status).send(validationResult);
      return false;
    }
    return this.model
      .findAll({
        raw: true,
        where: { email: infoObj.email },
      })
      .then((data) => {
        if (data.length === 0) {
          return {
            payload: [],
            status: 404,
          };
        }
        return { status: 200, payload: data };
      })
      .then((data) => res.status(data.status || 200).send(data.payload))
      .catch((err) => res.send(err));
  }
  add(req, res) {
    const infoObj = req.body;
    const validationResult = validators.ordersValidator(infoObj);
    if (!validationResult.success) {
      return res.status(validationResult.status).send(validationResult);
    }
    return this.masterModel
      .findOne({ where: { id: infoObj.masterId } })
      .then((data) => {
        if (data) {
          return this.townModel.findOne({ where: { name: infoObj.town } });
        } else {
          return Promise.reject({
            status: 400,
            msg: `Master with id ${infoObj.masterId} was not found`,
          });
        }
      })
      .then((data) => {
        if (!data) {
          return Promise.reject({ status: 400, msg: "Town not found" });
        } else {
          return this.model.create(infoObj);
        }
      })
      .then((data) => 
        res
          .status(200)
          .send({ success: true, msg: "You added order", payload: data })
      )
      .catch((err) =>
        res
          .status(err.status || 500)
          .send({ success: false, msg: err.msg || err })
      );
  }
  edit(req, res) {
    const infoObj = req.body;
    const validationResult = validators.ordersValidator(infoObj);
    if (!validationResult.success) {
      res.status(validationResult.status).send(validationResult);
      return false;
    }
    return this.masterModel
      .findOne({ where: { id: infoObj.masterId } })
      .then((data) => {
        if (data) {
          return this.townModel.findOne({ where: { name: infoObj.town } });
        } else {
          return Promise.reject({
            msg: `Master with id ${infoObj.masterId} not found!`,
            status: 404,
          });
        }
      })
      .then((data) => {
        if (data) {
          return this.model.update(infoObj, {
            where: {
              id: req.params.id,
            },
          });
        } else {
          return Promise.reject({
            msg: `Town with name ${infoObj.town} not found!`,
            status: 404,
          });
        }
      })
      .then((data) =>
        res
          .status(200)
          .send({ success: true, msg: "You update order", payload: data })
      )
      .catch((errData) =>
        res
          .status(errData.status || 500)
          .send({ success: false, msg: errData.msg || errData })
      );
  }
  delete(req, res) {
    return this.model
      .findOne({ where: { id: req.params.id } })
      .then((result) => {
        if (result) {
          return this.model.destroy({
            where: {
              id: req.params.id,
            },
          });
        } else {
          return Promise.reject({
            success: false,
            msg: `Order with id: ${req.params.id} not found`,
            status: 400
          });
        }
      })
      .then(() =>
        res.status(200).send({
          success: true,
          msg: "You deleted order",
          payload: +req.params.id,
        })
      )
      .catch((err) => res.status(err.status || 500).send(err));
  }
}

module.exports = new OrdersController(Order, Town, Master);
