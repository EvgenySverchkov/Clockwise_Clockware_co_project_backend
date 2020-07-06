const mysql = require("mysql");

const conn = mysql.createPool({
  connectionLimit: 5,
  host: "us-cdbr-east-05.cleardb.net",
  user: "b9d382caa58e34",
  database: "heroku_c647561c828c05a",
  password: "429f0925"
});


exports.getMasters = function(req, res){
  conn.query("SELECT * FROM masters", function(err, result){
    if(err){
      res.send(err);
    }else{
      res.send(result);
    }
  });
};

exports.postMaster = function(req, res){
  const master = [req.body.id, req.body.name, req.body.towns, req.body.rating];
  const sql = "INSERT INTO masters(id, name, towns, rating) VALUES(?, ?, ?, ?)";
  conn.query(sql, master, function(err, result){
    if(err){
      res.send(err);
    }else{
      res.send(req.body);
    }
  });
}

exports.putMaster = function(req,res){
  let sql = "UPDATE masters SET name=?,rating=?,towns=? WHERE id=?";
  let data = [req.body.name, req.body.rating, req.body.towns, req.params.id];
  conn.query(sql, data, function(err, result){
    if(err){
      res.send(err);
    }else{
      res.send(req.body);
    }
  });
}

exports.deleteMaster = function(req, res){
  const sql = `DELETE FROM masters WHERE id = ${req.params.id}`;
  conn.query(sql, function(err, results) {
      if(err){
        res.send(err);
      }else{
        res.send(req.params.id);
      }
  });
}
