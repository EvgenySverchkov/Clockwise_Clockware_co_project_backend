const townsModel = require("../models/townsModel");

exports.index = function(req,res){
  townsModel.getAllTowns()
  .then(data=>res.send(data))
  .catch(err=>res.send(err));
};

exports.add = function(req,res){
  const townInfo = [req.body.name, req.body.id];
  townsModel.postNewTown(townInfo, req.body)
  .then(data=>res.send(data))
  .catch(err=>res.send(err));
};

exports.edit = function(req,res){
  const dataArr = [req.body.name, req.params.id];
  townsModel.updateTown(dataArr, req.body)
  .then(data=>res.send(data))
  .catch(err=>res.send(err));
};

exports.delete = function(req,res){
  const townId = req.params.id;
  townsModel.deleteTown(townId)
  .then(data=>res.send(data))
  .catch(err=>res.send(err));
};
