const Sequelize = require("sequelize");

const Master = require("../models/mastersModel");
const Town = require("../models/townsModel");
const Masters_towns = require("../models/masters_towns");

class MastersController {
  constructor(masterModel, townModel, masters_towns) {
    this.masterModel = masterModel;
    this.townModel = townModel;
    this.masters_towns = masters_towns;

    this.index = this.index.bind(this);
    this.add = this.add.bind(this);
    this.edit = this.edit.bind(this);
    this.delete = this.delete.bind(this);

    this.masterModel.belongsToMany(this.townModel, {through: masters_towns});
    this.townModel.belongsToMany(this.masterModel, {through: masters_towns});
  }
  index(req, res) {
    this.masterModel.findAll({
      include: [{
        model: this.townModel,
      }]
    })
    .then(mastersArr=>{
      return mastersArr.map(item=>{
        item.towns = item.townsnames.map(item=>item.name).join(",")||"no towns";
        delete item.dataValues.townsnames
        return item;
      })
    })
    .then((data)=>{
      res.send(data)
    })
    .catch(err=>res.send(err));
  }
  add(req, res) {
    for (let key in req.body) {
      if (!req.body[key]) {
        res.status(400).send({ success: false, msg: "Please, fill all fields!" });
        return false;
      }
      switch(key){
        case 'name':
          if(req.body[key].match(/\d/) || !req.body[key].match(/\w{3,45}/)){
            res.status(400).send({success: false, msg: "String name should:\n1. Not contain numbers\n2. Not be shorter than 3 characters\n3. Not longer than 45 characters!"});
            return false;
          }
          break;
        case 'rating':
          if(+req.body[key] <= 0 || +req.body[key] > 5){
            res.status(400).send({success: false, msg: "Rating value must be from 1 to 5 inclusive"});
            return false;
          }
          break;
        case 'towns':
          if(req.body[key].match(/\s/)){
            res.status(400).send({success: false, msg: "Towns field must not contain space character"});
            return false;
          }
      }
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
    lastPromise.then(()=>townFields)
    .then(townsFields=>{
      return this.masterModel.create({...req.body})
      .then(master=>{
        master.addTownsnames(townsFields);
        return master;
      })
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
    .catch((err) => res.status(err.status||500).send(err));
  }
  edit(req, res) {
    for (let key in req.body) {
      if (!req.body[key]) {
        res.status(400).send({ success: false, msg: "Please, fill all fields!" });
        return false;
      }
    }
    if (req.body.name.match(/\d/)) {
      res
        .status(400)
        .send({
          success: false,
          msg: "The string name must not contain numbers!",
        });
      return false;
    }
    this.masterModel
      .update(req.body, {
        where: {
          id: req.params.id,
        },
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

module.exports = new MastersController(Master, Town, Masters_towns);
