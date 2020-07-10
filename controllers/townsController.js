const townsModel = require("../models/townsModel");
const configDB = require('../config/sequelizeConfig');

const Town = townsModel(configDB.connectOption, configDB.dataType);

exports.index = function(req,res){
  Town.findAll({raw: true})
  .then(data=>res.send(data))
  .catch(err=>res.send(err));
};

exports.add = function(req,res){
  Town.create(req.body)
  .then(data=>res.send(data))
  .catch(err=>res.send(err));
};

exports.edit = function(req,res){
  Town.update(req.body,{
    where: {
      id: req.params.id
    }
  })
  .then(data=>res.send(req.body))
  .catch(err=>res.send(err));
};

exports.delete = function(req,res){
  Town.destroy({
    where: {
      id: req.params.id
    }
  })
  .then(data=>res.send(req.params.id))
  .catch(err=>res.send(err));
};
