const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require('path');

const app = express();

app.use(cors());
const urlencodedParser = bodyParser.urlencoded({extended: true});
app.use(bodyParser.json());

const conn = mysql.createPool({
  connectionLimit: 5,
  host: "us-cdbr-east-05.cleardb.net",
  user: "b9d382caa58e34",
  database: "heroku_c647561c828c05a",
  password: "429f0925"
});

app.get('/', function (req, res) {
  res.send("Welcome to the server!!!")
});

app.get('/get_masters', function (req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  conn.query("SELECT * FROM masters", function(err, result){
    if(err){
      res.send(err);
    }else{
      res.send(result);
    }
  });
});

app.get('/get_towns', function(req,res){
  conn.query("SELECT * FROM townsnames", function(err, result){
    if(err){
      res.send(err);
    }else{
      res.send(result);
    }
  });
});

app.get('/get_orders', function (req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  conn.query("SELECT * FROM orders", function(err, result){
    if(err){
      res.send(err);
    }else{
      res.send(result);
    }
  });
});

app.post("/post_master", urlencodedParser, function(req, res){
  res.setHeader('Access-Control-Allow-Origin', '*');
  const master = [req.body.id, req.body.name, req.body.towns, req.body.rating];
  const sql = "INSERT INTO masters(id, name, towns, rating) VALUES(?, ?, ?, ?)";
  conn.query(sql, master, function(err, result){
    if(err){
      res.send(err);
    }else{
      res.send(req.body);
    }
  });
});

app.post("/post_town", urlencodedParser, function(req, res){
  res.setHeader('Access-Control-Allow-Origin', '*');
  const sql = "INSERT INTO townsnames (name, id) VALUES(?, ?)";
  const townInfo = [req.body.name, req.body.id];
  conn.query(sql, townInfo, function(err, result){
    if(err){
      res.send(err);
    }else{
      res.send(req.body);
    }
  });
});

app.post("/post_order", urlencodedParser, function(req, res){
  res.setHeader('Access-Control-Allow-Origin', '*');
  const sql = "INSERT INTO orders (id, name, email, size, town, date, time, masterId) VALUES(?, ?, ?, ?, ?, ?, ?, ?)";
  const orderInfo = [req.body.id, req.body.name, req.body.email,
                     req.body.clockSize, req.body.town, req.body.date,
                     req.body.time, req.body.masterId];
  conn.query(sql, orderInfo, function(err, result){
    if(err){
      res.send(err);
    }else{
      res.send(req.body);
    }
  });
});

app.put("/put_master/:id", urlencodedParser, function(req,res){
  let sql = "UPDATE masters SET name=?,rating=?,towns=? WHERE id=?";
  let data = [req.body.name, req.body.rating, req.body.towns, req.params.id];
  conn.query(sql, data, function(err, result){
    if(err){
      res.send(err);
    }else{
      res.send(req.body);
    }
  });
});

app.put("/put_town/:id", urlencodedParser, function(req,res){
  let sql = "UPDATE townsnames SET name=? WHERE id=?";
  let data = [req.body.name, req.params.id];
  conn.query(sql, data, function(err, result){
    if(err){
      res.send(err);
    }else{
      res.send(req.body);
    }
  });
});

app.put("/put_order/:id", urlencodedParser, function(req,res){
  let sql = "UPDATE orders SET name=?, email=?, size=?, town=?, date=?, time=?, masterId=? WHERE id=?";
  let data = [req.body.name, req.body.email,
              req.body.clockSize, req.body.town, req.body.date,
              req.body.time, req.body.masterId, req.body.id];
  conn.query(sql, data, function(err, result){
    if(err){
      res.send(err);
    }else{
      res.send(req.body);
    }
  });
});

app.delete("/delete_master/:id", function(req, res){
  const sql = `DELETE FROM masters WHERE id = ${req.params.id}`;
  conn.query(sql, function(err, results) {
      if(err){
        res.send(err);
      }else{
        res.send(req.params.id);
      }
  });
});

app.delete("/delete_town/:id", function(req,res){
  const sql = `DELETE FROM townsnames WHERE id = ${req.params.id}`;
  conn.query(sql, function(err, results){
    if(err){
      res.send(err);
    }else{
      res.send(req.params.id);
    }
  });
});

app.delete("/delete_order/:id", function(req,res){
  const sql = `DELETE FROM orders WHERE id = ${req.params.id}`;
  conn.query(sql, function(err, results){
    if(err){
      res.send(err);
    }else{
      res.send(req.params.id);
    }
  });
});

app.listen(process.env.PORT || 9000, function(){
  console.log("Server start")
})
