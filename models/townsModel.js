const sqlConnection = require("../config/dbConnection");

exports.getAllTowns = function(){
  return new Promise(function(res, rej){
    sqlConnection.query("SELECT * FROM townsnames", function(err, result){
      if(err){
        rej(err);
      }else{
        res(result);
      }
    });
  });
};

exports.postNewTown = function(dataArr, reqBody){
  return new Promise(function(res, rej){
    const sql = "INSERT INTO townsnames (name, id) VALUES(?, ?)";
    sqlConnection.query(sql, dataArr, function(err, result){
      if(err){
        rej(err);
      }else{
        res(reqBody);
      }
    });
  });
};

exports.updateTown = function(dataArr, reqBody){
  return new Promise(function(res, rej){
    const sql = "UPDATE townsnames SET name=? WHERE id=?";
    sqlConnection.query(sql, dataArr, function(err, result){
      if(err){
        rej(err);
      }else{
        res(reqBody);
      }
    });
  });
};

exports.deleteTown = function(townId){
  return new Promise(function(res, rej){
    const sql = `DELETE FROM townsnames WHERE id = ${townId}`;
    sqlConnection.query(sql, function(err, results){
      if(err){
        rej(err);
      }else{
        res(townId);
      }
    });
  });
};
