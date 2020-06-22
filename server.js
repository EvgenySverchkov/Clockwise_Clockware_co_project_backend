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
  res.send("Hello")
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
    };
  });
});

app.post("/post_master", urlencodedParser, function(req, res){
  res.setHeader('Access-Control-Allow-Origin', '*');
  const master = [req.body.id, req.body.name, req.body.towns, req.body.rating];
  const sql = "INSERT INTO masters(id, name, towns, rating) VALUES(?, ?, ?, ?)";
  conn.query(sql, master, function(err, results) {
    if(err){
      res.send("Error: ", err)
    }
    else {
      res.send(req.body)
    }});
});

app.post("/post_town", urlencodedParser, function(req, res){
  res.setHeader('Access-Control-Allow-Origin', '*');
  const sql = "INSERT INTO townsnames (name, id) VALUES(?, ?)";
  const townInfo = [req.body.name, req.body.id];
  console.log(req.body)
  conn.query(sql, townInfo, function(err, result){
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

app.listen(process.env.PORT || 9000, function(){
  console.log("Server start")
})
