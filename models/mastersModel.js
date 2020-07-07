const sqlConnection = require("../config/dbConnection");

exports.getAllMasters = function(){
  return new Promise(function(res, rej){
    sqlConnection.query("SELECT * FROM masters", function(err, result){
      if(err){
        rej(err);
      }else{
        res(result);
      }
    });
  });
}

exports.postNewMaster = function(dataArr, reqBody){
  return new Promise(function(res,rej){
    const sql = "INSERT INTO masters(id, name, towns, rating) VALUES(?, ?, ?, ?)";
    sqlConnection.query(sql, dataArr, function(err, result){
      if(err){
        rej(err);
      }else{
        res(reqBody);
      }
    });
  });
}

exports.updateMaster = function(dataArr, reqBody){
  return new Promise(function(res, rej){
    const sql = "UPDATE masters SET name=?,rating=?,towns=? WHERE id=?";
    sqlConnection.query(sql, dataArr, function(err, result){
        if(err){
          rej(err);
        }else{
          res(reqBody);
        }
      });
  });
};

exports.deleteMaster = function(masterId){
  return new Promise(function(res, rej){
    const sql = `DELETE FROM masters WHERE id = ${masterId}`;
    sqlConnection.query(sql, function(err, results) {
      if(err){
        rej(err);
      }else{
        res(masterId);
      }
    });
  });
}
