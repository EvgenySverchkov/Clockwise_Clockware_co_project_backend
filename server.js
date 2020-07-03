const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require('path');
const nodemailer = require('nodemailer');

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
///////////////////////////////////////////////////////////////////nodemailer////////////////////////////////////////////////


app.post("/send_message", async function(req, res){
  let testEmailAccount = await nodemailer.createTestAccount();
  let transporter = nodemailer.createTransport({
     service: 'gmail',
     auth: {
         user: "confirmationsendler@gmail.com",
         pass: "qwertyuiop1234!"
       }
     });
  let options = {
      from: '"Clockwise" <confirmationsendler@gmail.com>',
      to: req.body.email,
      subject: "Confirmation of an order",
      text: `You ordered master on ${req.body.date} ${req.body.time} in ${req.body.town}`,
      html: `You ordered master on ${req.body.date} ${req.body.time} in ${req.body.town}`
    }
  let result = await transporter.sendMail(options, function(err, info){
    if(err){
      res.json(err);
    }
    console.log("email is send");
    res.json(info);
  });
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

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
              req.body.size, req.body.town, req.body.date,
              req.body.time, req.body.masterId, req.body.id];
  conn.query(sql, data, function(err, result){
    if(err){
      res.send(err);
    }else{
      console.log(req.body)
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
