const Master = require("../models/mastersModel");
const Town = require("../models/townsModel");
const MasterAndTowns = require("../models/MasterAndTownsModel");

class MastersController {
  constructor(model, townModel, mastersAndTownModel) {
    this.model = model;
    this.townModel = townModel;
    this.mastersAndTownModel = mastersAndTownModel;
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
    }
    if(req.body.name.match(/\d/)) {
      res.status(400).send({ success: false, msg: "The string name must not contain numbers!" });
      return false;
    }
    this.model
      .create(req.body)
      .then((masterData) => {
        const townsArr = req.body.towns.split(",");
        let last = Promise.resolve();
        townsArr.forEach(item=>{
          last = last.then(()=>{
            this.townModel.findOne({where:{name: item}})
            .then(data=>{
              if(!data){
                return Promise.reject(()=>{
                  return {status: 500, msg: "town no found"}
                });
              }else{
                return this.mastersAndTownModel.create({masterId: masterData.dataValues.id, townId: data.id});
              }
            })
          })
        });
        return last.then(()=>{
          return { success: true, msg: "You added master", payload: masterData, status:200 };
        });
      })
      .then(data=>{
        console.log(data);
        res.status(data.status).send(data);
      })
      .catch((err) => res.status(err.status).send(err));
  }
  edit(req, res) {
    for (let key in req.body) {
      if (!req.body[key]) {
        res.status(400).send({ success: false, msg: "Filling all gaps!!" });
        return false;
      }
    }
    if(req.body.name.match(/\d/)) {
      res.status(400).send({ success: false, msg: "The string name must not contain numbers!" });
      return false;
    }
    this.model
      .update(req.body, {
        where: {
          id: req.params.id,
        },
      })
      .then((data) =>
        res.status(200).send({ success: true, msg: "You update master", payload: data })
      )
      .catch((err) => res.status(500).send({ success: false, msg: err}));
  }
  delete(req, res) {
    this.model
      .findOne({where: {id: req.params.id}})
      .then((result) => {
        if (result) {
          return this.model.destroy({where: {id: req.params.id}});
        } else {
          res
            .status(400)
            .send({
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
      .catch((err) => res.status(500).send({success: false, msg: err}));
  }
}

module.exports = new MastersController(Master, Town, MasterAndTowns);
