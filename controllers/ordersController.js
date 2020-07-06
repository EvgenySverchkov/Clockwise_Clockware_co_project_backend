const mysql = require("mysql");

const conn = mysql.createPool({
  connectionLimit: 5,
  host: "us-cdbr-east-05.cleardb.net",
  user: "b9d382caa58e34",
  database: "heroku_c647561c828c05a",
  password: "429f0925"
});

exports.getOrders = function (req, res) {
  conn.query("SELECT * FROM orders", function(err, result){
    if(err){
      res.send(err);
    }else{
      res.send(result);
    }
  });
}

exports.postOrder = function(req, res){
  res.setHeader('Access-Control-Allow-Origin', '*');
  const sql = "INSERT INTO orders (id, name, email, size, town, date, time, masterId, endTime) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)";
  const orderInfo = [req.body.id, req.body.name, req.body.email,
                     req.body.size, req.body.town, req.body.date,
                     req.body.time, req.body.masterId, req.body.endTime];
  conn.query(sql, orderInfo, function(err, result){
    if(err){
      res.send(err);
    }else{
      res.send(req.body);
    }
  });
}

exports.putOrder = function(req,res){
  let sql = "UPDATE orders SET name=?, email=?, size=?, town=?, date=?, time=?, masterId=? WHERE id=?";
  let data = [req.body.name, req.body.email,
              req.body.size, req.body.town, req.body.date,
              req.body.time, req.body.masterId, req.body.id];
  conn.query(sql, data, function(err, result){
    if(err){
      res.send(err);
    }else{
      res.send(req.body);
    }
  });
}

exports.deleteOrder = function(req,res){
  const sql = `DELETE FROM orders WHERE id = ${req.params.id}`;
  conn.query(sql, function(err, results){
    if(err){
      res.send(err);
    }else{
      res.send(req.params.id);
    }
  });
}
