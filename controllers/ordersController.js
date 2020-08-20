const Order = require("../models/ordersModel");
const Town = require("../models/townsModel");
const Master = require("../models/mastersModel");
const dateHelper = require("../helpers/dateHelper");

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
    this.model
      .findAll({ raw: true })
      .then((data) => res.send(data))
      .catch((err) => res.send(err));
  }
  getUserOrders(req, res){
    console.log(req.body, "!!!!!")
    this.model
      .findAll({
        raw: true,
        where: {email: req.body.email} 
      })
      .then(data=>res.send(data))
      .catch(err=> res.send(err));
  }
  add(req, res) {
    const infoObj = req.body;
    for (let key in infoObj) {
      if (!infoObj[key]) {
        res
          .status(400)
          .send({ success: false, msg: "Please, fill all fields!" });
        return false;
      }
      const dataValidation = this.validation(key, infoObj);
      if (!dataValidation.success) {
        res.status(dataValidation.status).send(dataValidation);
        return false;
      }
      if(key === "time"){
        console.log(key)
        if(infoObj[key] >= "18:00" || infoObj[key] < "09:00"){
          console.log(infoObj[key])
          res
          .status(400)
          .send({ success: false, msg: "Time should not be more than 18:00 and less than 09:00" });
          return false;
        }
      }
    }
    this.masterModel
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
      .then((data) => {
        res.send({ success: true, msg: "You added order", payload: data });
      })
      .catch((err) =>
        res.status(err.status || 500).send({ success: false, msg: err })
      );
  }
  edit(req, res) {
    const infoObj = req.body;
    for (let key in infoObj) {
      if (!infoObj[key]) {
        res
          .status(400)
          .send({ success: false, msg: "Please, fill all fields!" });
        return false;
      }
      if(key === "time"){
        console.log(key)
        if(infoObj[key] >= "18:00" || infoObj[key] < "09:00"){
          res
          .status(400)
          .send({ success: false, msg: "Time should not be more than 18:00 and less than 09:00" });
          return false;
        }
      }
      const dataValidation = this.validation(key, infoObj);
      if (!dataValidation.success) {
        res.status(dataValidation.status).send(dataValidation);
        return false;
      }
    }
    this.masterModel
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
  validation(fieldName, dataObj) {
    switch (fieldName) {
      case "name":
        if (dataObj[fieldName].length <= 3 || dataObj[fieldName].length > 45) {
          return {
            success: false,
            msg: "Name must be at least 3 characters",
            status: 400,
          };
        }
        return { success: true };
      case "email":
        if (!dataObj[fieldName].match(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/)) {
          return {
            success: false,
            msg: "Invalid email format. Please check your email!",
            status: 400,
          };
        }
        return { success: true };
      case "size":
        if (!dataObj[fieldName].match(/\blarge\b|\bsmall\b|\bmiddle\b/)) {
          return {
            success: false,
            msg:
              "The size field should only include such values:\n1. small\n2. middle\n3. large",
            status: 400,
          };
        }
        return { success: true };
      case "date":
        console.log(dataObj[fieldName]);
        if (
          !dataObj[fieldName].match(
            /(20|21|22)\d\d-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])/
          )
        ) {
          return {
            success: false,
            msg: "The date must be in the format: dd-mm-yyyy",
            status: 400,
          };
        }
        if (!dateHelper.isClientDateLargeThenCurrDate(dataObj[fieldName])) {
          return {
            success: false,
            msg: "Date must not be less than or equal to the current date!",
            status: 400,
          };
        }
        return { success: true };
      default:
        return { success: true };
    }
  }
}

module.exports = new OrdersController(Order, Town, Master);
