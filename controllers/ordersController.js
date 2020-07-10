const ordersModel = require("../models/ordersModel.js");
const configDB = require('../config/sequelizeConfig');

const Order = ordersModel(configDB.connectOption, configDB.dataType);

exports.index = function (req, res) {
  Order.findAll({raw: true})
  .then(data=>res.send(data))
  .catch(err=>res.send(err));
}

exports.add = function(req,res){
  Order.create(req.body)
  .then(data=>res.send(data))
  .catch(err=>res.send(err));
};

exports.edit = function(req,res){
  Order.update(req.body, {
    where: {
      id: req.params.id
    }
  })
  .then(data=>res.send(req.body))
  .catch(err=>res.send(err));
}

exports.delete = function(req,res){
  Order.destroy({
    where: {
      id: req.params.id
    }
  })
  .then(data=>res.send(req.params.id))
  .catch(err=>res.send(err));
}