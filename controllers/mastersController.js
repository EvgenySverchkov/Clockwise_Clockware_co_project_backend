const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const {connectOption} = require("../config/sequelizeConfig");

const Master = require("../models/mastersModel");
const Town = require("../models/townsModel");
const Order = require("../models/ordersModel.js");
const MastersTowns = require("../models/masters_towns");

const validators = require("../helpers/validators");

class MastersController {
  constructor(masterModel, townModel, orderModel, mastersTowns) {
    this.masterModel = masterModel;
    this.townModel = townModel;
    this.orderModel = orderModel;
    this.mastersTowns = mastersTowns;

    this.index = this.index.bind(this);
    this.add = this.add.bind(this);
    this.edit = this.edit.bind(this);
    this.delete = this.delete.bind(this);
    this.getAllMasters = this.getAllMasters.bind(this);
    this.getFreeMasters = this.getFreeMasters.bind(this);

    this.masterModel.belongsToMany(this.townModel, { through: mastersTowns });
    this.townModel.belongsToMany(this.masterModel, { through: mastersTowns });

    this.mastersTowns.sync({force: true});
  }
  getAllMasters(res) {
    this.masterModel
      .findAll({
        include: [
          {
            model: this.townModel,
          },
        ],
      })
      .then((mastersArr) => {
        return mastersArr.map((item) => {
          item.towns =
            item.townsnames.map((item) => item.name).join(",") || "no towns";
          delete item.dataValues.townsnames;
          return item;
        });
      })
      .then((data) => {
        res.send(data);
      })
      .catch((err) => res.send(err));
  }
  getFreeMasters(req, res) {
    const validationResult = validators.getFreeMastersValidator(req.body);
    if(!validationResult.success){
      res.status(validationResult.status).send(validationResult);
      return false;
    }
    let mastersArrByTown;
    this.townModel
      .findOne({
        where: {
          name: req.body.town,
        },
      })
      .then((towns) =>
        this.townModel.findOne({
          include: [
            {
              model: this.masterModel,
            },
          ],
          where: { id: towns.id },
        })
      )
      .then((result) => {
        if (result.length === 0) {
          return Promise.reject({
            msg: "We don't have masters in this town",
            status: 404,
          });
        } else {
          const infoObj = req.body;
          mastersArrByTown = result.masters;
          return this.orderModel.findAll({
            where: {
              date: infoObj.date,
              [Op.or]: [
                { time: infoObj.timeStart },
                { endTime: { [Op.gte]: infoObj.timeStart } },
              ],
            },
          });
        }
      })
      .then((result) => {
        let bookedMastersIdx = result.map((item) => item.masterId);
        let freeMasters = mastersArrByTown.filter(
          (item) => !bookedMastersIdx.includes(item.id)
        );
        if (freeMasters.length === 0) {
          return Promise.reject({
            msg: "We don't have masters on these date and time",
            status: 404,
          });
        } else {
          return {
            success: true,
            msg: "We have free masters",
            payload: freeMasters,
            status: 200,
          };
        }
      })
      .then((data) => res.status(data.status).send(data))
      .catch((err) => res.status(err.status || 500).send(err));
  }
  index(req, res) {
    switch (req.headers.include) {
      case "all":
        this.getAllMasters(res);
        break;
      case "free":
        this.getFreeMasters(req, res);
        break;
      default:
        res
          .status(400)
          .send({
            success: false,
            msg:
              "You must provide a value field with a value of 'all' or 'free'",
          });
    }
  }
  add(req, res) {
    const validationResult = validators.mastersValidator(req.body);
    if(!validationResult.success){
      res.status(validationResult.status).send(validationResult);
      return false;
    }
    const townsArr = req.body.towns.split(",");
    let lastPromise = Promise.resolve();
    let townFields = [];

    townsArr.forEach((item) => {
      lastPromise = lastPromise.then(() => {
        return this.townModel
          .findOne({ where: { name: item } })
          .then((town) => townFields.push(town));
      });
    });
    lastPromise
      .then(() => townFields)
      .then((townsFields) => {
        return this.masterModel.create({ ...req.body }).then((master) => {
          master.addTownsnames(townsFields);
          return master;
        });
      })
      .then((masterData) => {
        return {
          success: true,
          msg: "You added master",
          payload: masterData,
          status: 200,
        };
      })
      .then((data) => {
        res.status(data.status).send(data);
      })
      .catch((err) => res.status(err.status || 500).send(err));
  }
  edit(req, res) {
    const validationResult = validators.mastersValidator(req.body);
    if(!validationResult.success){
      res.status(validationResult.status).send(validationResult);
      return false;
    }
    const townsArr = req.body.towns.split(",");
    let lastPromise = Promise.resolve();
    let townFields = [];

    townsArr.forEach((item) => {
      lastPromise = lastPromise.then(() => {
        return this.townModel
          .findOne({ where: { name: item } })
          .then((town) => townFields.push(town));
      });
    });
    lastPromise
      .then(() => townFields)
      .then((townsFields) => {
        return this.masterModel
          .findOne({
            where: {
              id: req.body.id,
            },
            include: [{ model: this.townModel }],
          })
          .then((master) => {
            if (master) {
              if (townsFields.length <= master.townsnames.length) {
                master.townsnames.forEach((item) => {
                  if (townsFields.find((item1) => item.name === item1.name)) {
                    console.log("Nothing", item.name);
                  } else {
                    master.removeTownsname(item);
                    console.log("Delete", item.name);
                  }
                });
              }

              if (townsFields.length >= master.townsnames.length) {
                townsFields.forEach((item) => {
                  if (
                    master.townsnames.find((item1) => item.name === item1.name)
                  ) {
                    console.log("Do nothing", item.name);
                  } else {
                    master.addTownsname(item);
                    console.log("Add association", item.name);
                  }
                });
              }
              return master.update(req.body, {
                where: {
                  id: req.params.id,
                },
              });
            }
          });
      })
      .then((data) =>
        res
          .status(200)
          .send({ success: true, msg: "You updated the master", payload: data })
      )
      .catch((err) => res.status(500).send({ success: false, msg: err }));
  }
  delete(req, res) {
    this.masterModel
      .findOne({ where: { id: req.params.id } })
      .then((result) => {
        if (result) {
          return this.masterModel.destroy({ where: { id: req.params.id } });
        } else {
          res.status(400).send({
            success: false,
            msg: `Master with id: ${req.params.id} not found`,
          });
        }
      })
      .then(() =>
        res.status(200).send({
          success: true,
          msg: "You deleted master",
          payload: +req.params.id,
        })
      )
      .catch((err) => res.status(500).send({ success: false, msg: err }));
  }
}

module.exports = new MastersController(Master, Town, Order, MastersTowns);
