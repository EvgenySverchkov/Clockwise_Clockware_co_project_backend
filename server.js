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

app.post("/post_master", urlencodedParser, function(req, res){
  console.log(req.body, "BODY");
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

app.delete("/delete_master/:id", urlencodedParser, function(res,req){
  res.setHeader('Access-Control-Allow-Origin', '*');
  console.log("DELEEEEEEEEEEEEET", req.params);
  res.send();
  /*const sql = `DELETE FROM masters WHERE id = ${req.body.id}`;
  conn.query(sql, function(err, result){
    if(err){
      res.send(err);
    }else{
      res.send("Master deleted")
    }
  });*/
});
  // const name = req.body.name;
  // const towns = req.body.towns;
  // const rating = +req.body.rating;

  // let master= [null, name, towns, rating];
  // const sql = "INSERT INTO masters(id, name, towns, rating) VALUES(?, ?, ?, ?)";
  // conn.query(sql, master, function(err, results) {
  //   if(err){
  //     res.send("Error: ", err)
  //   }
  //   else {
  //     res.send("Master is add")
  //   }
  // });
});



app.listen(process.env.PORT || 9000, function(){
  console.log("Server start")
})
