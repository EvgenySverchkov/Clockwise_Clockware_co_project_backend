const Master = require('../models/mastersModel');

exports.index = function(req, res){
  Master.findAll({raw:true})
  .then((data)=>res.send(data))
  .catch((err)=>res.send(err));
}

exports.add = function(req, res){
  Master.create(req.body)
  .then(data=>res.send(data))
  .catch(err=>res.send(err));
};

exports.edit = function(req,res){
  Master.update(req.body, {
    where: {
      id: req.params.id
    },
  })
  .then(data=>res.send(req.body))
  .catch(err=>res.send(err));
};

exports.delete = function(req, res){
  Master.destroy({
    where: {
      id: req.params.id
    }
  })
  .then(data=>res.send(req.params.id))
  .catch(err=>res.send(err));
};
