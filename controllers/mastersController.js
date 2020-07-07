const mastersModel = require('../models/mastersModel');

exports.index = function(req, res){
  mastersModel.getAllMasters()
  .then((data)=>res.send(data))
  .catch((err)=>res.send(err));
}

exports.add = function(req, res){
  const master = [req.body.id, req.body.name, req.body.towns, req.body.rating];
  mastersModel.postNewMaster(master, req.body)
  .then(data=>res.send(data))
  .catch(err=>res.send(err));
};

exports.edit = function(req,res){
  const dataArr = [req.body.name, req.body.rating, req.body.towns, req.params.id];
  mastersModel.updateMaster(dataArr, req.body)
  .then(data=>res.send(data))
  .catch(err=>res.send(err));
};

exports.delete = function(req, res){
  const masterId = req.params.id;
  mastersModel.deleteMaster(masterId)
  .then(data=>res.send(data))
  .catch(err=>res.send(err));
};
