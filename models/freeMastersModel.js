const qs = require("qs");
const sqlConnection = require("../config/dbConnection");

exports.getAllFreeMasters = function(dataParams){
  return new Promise(function(rej, res){
    const sql = "SELECT * FROM masters";
    sqlConnection.query(sql, function(err, result){
      if(err){
        rej(err);
      }
      const infoObj = qs.parse(dataParams);
      let mastersArrByTown = result.filter(item=>{
        let townsArr = item.towns.split(',');
        if(townsArr.includes(infoObj.town)){
          return true;
        }else{
          return false;
        }
      });
      const sql2 = "SELECT * FROM orders";
      sqlConnection.query(sql2, function(err, result){
        if(err){
          rej(err);
        }
        let bookedMastersIdx = [];
        result.forEach(item=>{
          if(item.date === infoObj.date){
            let orderHourStart = +item.time.match(/[^:]+/);
            let clientHourStart = +infoObj.timeStart.match(/[^:]+/);
            let orderHourEnd = +item.endTime.match(/[^:]+/);
            let clientHourEnd = +infoObj.timeEnd.match(/[^:]+/);
            if(orderHourStart === clientHourStart || clientHourEnd>orderHourEnd){
              bookedMastersIdx.push(item.masterId);
            }
          }
        });
        let freeMasters = mastersArrByTown.filter(item=>!bookedMastersIdx.includes(item.id))
        res(freeMasters);
      });
    });
  });
}
