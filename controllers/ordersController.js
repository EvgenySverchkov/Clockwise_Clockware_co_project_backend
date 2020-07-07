const ordersModel = require("../models/ordersModel.js");

exports.index = function (req, res) {
  ordersModel.getAllOrders()
  .then(data=>res.send(data))
  .catch(err=>res.send(err));
}
exports.add = function(req,res){
  const orderInfo = [req.body.id, req.body.name, req.body.email,
                     req.body.size, req.body.town, req.body.date,
                     req.body.time, req.body.masterId, req.body.endTime];
  ordersModel.postNewOrder(orderInfo, req.body)
  .then(data=>res.send(data))
  .catch(err=>res.send(err));
};

exports.edit = function(req,res){
  const data = [req.body.name, req.body.email,
              req.body.size, req.body.town, req.body.date,
              req.body.time, req.body.masterId, req.body.id];
  ordersModel.updateOrder(data, req.body)
  .then(data=>res.send(data))
  .catch(err=>res.send(err));
}

exports.delete = function(req,res){
  const orderId = req.params.id;
  ordersModel.deleteOrder(orderId)
  .then(data=>res.send(data))
  .catch(err=>res.send(err));
}
