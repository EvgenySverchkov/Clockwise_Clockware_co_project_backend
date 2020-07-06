const mysql = require("mysql");

const conn = mysql.createPool({
  connectionLimit: 5,
  host: "us-cdbr-east-05.cleardb.net",
  user: "b9d382caa58e34",
  database: "heroku_c647561c828c05a",
  password: "429f0925"
});

exports.getTowns = function(req,res){
  conn.query("SELECT * FROM townsnames", function(err, result){
    if(err){
      res.send(err);
    }else{
      res.send(result);
    }
  });
}

exports.postTown = function(req, res){
  const sql = "INSERT INTO townsnames (name, id) VALUES(?, ?)";
  const townInfo = [req.body.name, req.body.id];
  conn.query(sql, townInfo, function(err, result){
    if(err){
      res.send(err);
    }else{
      res.send(req.body);
    }
  });
}

exports.putTown = function(req,res){
  let sql = "UPDATE townsnames SET name=? WHERE id=?";
  let data = [req.body.name, req.params.id];
  conn.query(sql, data, function(err, result){
    if(err){
      res.send(err);
    }else{
      res.send(req.body);
    }
  });
}

exports.deleteTown = function(req,res){
  const sql = `DELETE FROM townsnames WHERE id = ${req.params.id}`;
  conn.query(sql, function(err, results){
    if(err){
      res.send(err);
    }else{
      res.send(req.params.id);
    }
  });
}
