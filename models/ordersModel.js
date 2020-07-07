const sqlConnection = require("../config/dbConnection");

exports.getAllOrders = function(){
  return new Promise(function(res,rej){
    sqlConnection.query("SELECT * FROM orders", function(err, result){
      if(err){
        rej(err);
      }else{
        res(result);
      }
    });
  });
}
exports.postNewOrder = function(dataArr, reqBody){
  return new Promise(function(res, rej){
    const sql = "INSERT INTO orders (id, name, email, size, town, date, time, masterId, endTime) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)";
    sqlConnection.query(sql, dataArr, function(err, result){
      if(err){
        rej(err);
      }else{
        res(reqBody);
      }
    });
  });
}
exports.updateOrder = function(dataArr, reqBody){
  return new Promise(function(res, rej){
    const sql = "UPDATE orders SET name=?, email=?, size=?, town=?, date=?, time=?, masterId=? WHERE id=?";
    sqlConnection.query(sql, dataArr, function(err, result){
      if(err){
        rej(err);
      }else{
        res(reqBody);
      }
    });
  });
};
exports.deleteOrder = function(orderId){
  return new Promise(function(res, rej){
    const sql = `DELETE FROM orders WHERE id = ${orderId}`;
    sqlConnection.query(sql, function(err, results){
      if(err){
        rej(err);
      }else{
        res(orderId);
      }
    });
  });
};
