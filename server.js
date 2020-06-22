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
  console.log(req.body)
  res.setHeader('Access-Control-Allow-Origin', '*');
  const master = [null, "New", "D", 2];
  const sql = "INSERT INTO masters(id, name, towns, rating) VALUES(?, ?, ?, ?)";
  conn.query(sql, master, function(err, results) {
    if(err){
      res.send("Error: ", err)
    }
    else {
      res.send("HI")
    }});
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
