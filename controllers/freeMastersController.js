const freeMastersModel = require('../models/freeMastersModel');

exports.index = function(req, res){
  freeMastersModel.getAllFreeMasters(req.params.infoObj)
  .then(data=>res.send(data))
  .catch(err=>res.send(err));
};
