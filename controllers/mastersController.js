const Master = require('../models/mastersModel');

class MastersController{
  constructor(model){
    this.model = model;
    this.index = this.index.bind(this);
    this.add = this.add.bind(this);
    this.edit = this.edit.bind(this);
    this.delete = this.delete.bind(this);
  }
  index(req, res){
    this.model.findAll({raw:true})
    .then((data)=>res.send(data))
    .catch((err)=>res.send(err));
  }
  add(req, res){
    this.model.create(req.body)
    .then(data=>res.send(data))
    .catch(err=>res.send(err));
  }
  edit(req,res){
    this.model.update(req.body, {
      where: {
        id: req.params.id
      },
    })
    .then(data=>res.send(req.body))
    .catch(err=>res.send(err));
  }
  delete(req, res){
    this.model.destroy({
      where: {
        id: req.params.id
      }
    })
    .then(data=>res.send(req.params.id))
    .catch(err=>res.send(err));
  }
}

module.exports = new MastersController(Master);
