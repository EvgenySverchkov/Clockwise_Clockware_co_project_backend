const Town = require("../models/townsModel");
const validators = require("../helpers/validators");

class TownsController {
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
    const validationResult = validators.townsValidator(req.body);
    if (!validationResult.success) {
      res.status(validationResult.status).send(validationResult);
      return false;
    }
    this.model
      .findOne({ where: { name: req.body.name } })
      .then((result) => {
        if (result) {
          return Promise.reject({
            success: false,
            msg: "The name of this town is already on the list!",
            status: 400,
          });
        } else {
          return this.model.create(req.body);
        }
      })
      .then((data) =>
        res
          .status(200)
          .send({ success: true, msg: "You added town", payload: data })
      )
      .catch((data) => res.status(data.status).send(data));
  }
  edit(req, res) {
    const validationResult = validators.townsValidator(req.body);
    if (!validationResult.success) {
      res.status(validationResult.status).send(validationResult);
      return false;
    }
    this.model
      .findOne({ where: { name: req.body.name } })
      .then((result) => {
        if (result) {
          return Promise.reject({
            success: false,
            msg: "The name of this town is already on the list!!",
            status: 400,
          });
        } else {
          return this.model.update(req.body, {
            where: {
              id: req.params.id,
            },
          });
        }
      })
      .then((data) =>
        res
          .status(200)
          .send({ success: true, msg: "You updated town", payload: data })
      )
      .catch((data) => res.status(data.status).send(data));
  }
  delete(req, res) {
    this.model
      .findOne({ where: { id: req.params.id } })
      .then((result) => {
        if (result) {
          return this.model.destroy({ where: { id: req.params.id } });
        } else {
          return Promise.reject({status: 400, success: false, msg: `Town with id: ${req.params.id} not found`});
        }
      })
      .then(() =>
        res.status(200).send({
          success: true,
          msg: "You deleted town",
          payload: +req.params.id,
        })
      )
      .catch((err) => res.status(err.status||500).send(err));
  }
}

module.exports = new TownsController(Town);
