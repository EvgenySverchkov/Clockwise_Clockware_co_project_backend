const Order = require("../models/ordersModel");
const Town = require("../models/townsModel");
const Master = require("../models/mastersModel");

class OrdersController {
  constructor(model, townModel, masterModel) {
    this.model = model;
    this.townModel = townModel;
    this.masterModel = masterModel;
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
      switch(key){
        case "name":
          if(req.body[key].length <= 3 || req.body[key].length > 45){
            res.status(400).send({ success: false, msg: "Name must be at least 3 characters" });
            return false;
          }
          break;
        case "email":
          if(!req.body[key].match(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/)){
            res.status(400).send({ success: false, msg: "The format of your email is incorrect, please check it!!!" });
            return false;
          }
          break;
        case "size":
          if(!req.body[key].match(/\blarge\b|\bsmall\b|\bmiddle\b/)){
            res.status(400).send({ success: false, msg: "The size field should only include such values:\n1. small\n2. middle\n3. large" });
            return false;
          }
          break;
        case "date":
          if(!req.body[key].match(/(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[012])-(20|21|22)\d\d/)){
            res.status(400).send({ success: false, msg: "The date must be in the format: dd-mm-yyyy" });
            return false;
          }
          if(!this.isClientDateLargeThenCurrDate(req.body[key])){
            res.status(400).send({ success: false, msg: "Date must not be less than or equal to the current date" });
            return false;
          }
          break;
        case "time":
          if(!req.body[key].match(/\d\d:\d\d/)){
            res.status(400).send({ success: false, msg: "The time must be in the format: hh:mm" });
            return false;
          }
          break;
        case "endTime":
          if(!req.body[key].match(/\d\d:\d\d/)){
            res.status(400).send({ success: false, msg: "The time must be in the format: hh:mm" });
            return false;
          }
          break;
      }
    }
    this.masterModel
      .findOne({where: {id: req.body.masterId}})
      .then(data=>{
        if(data){
          return this.townModel.findOne({ where: { name: req.body.town } })
        }else{
          return Promise.reject({ status: 400, msg: `Master with id ${req.body.masterId} was not found` });
        }
      })
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
  isClientDateLargeThenCurrDate(clientDate){
    const datetime_regex = /(\d\d)-(\d\d)-(\d\d\d\d)/;
    const client_date_arr = datetime_regex.exec(clientDate);
    const client_datetime = new Date(`${client_date_arr[3]}-${client_date_arr[2]}-${client_date_arr[1]}`);
    const currDate = new Date();

    if(currDate.getTime() > client_datetime.getTime()) {
      return false;
    } else {
      return true;
    }
  }
}

module.exports = new OrdersController(Order, Town, Master);
