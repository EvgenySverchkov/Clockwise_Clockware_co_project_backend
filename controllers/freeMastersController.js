const mastersModel = require('../models/mastersModel');
const ordersModel = require("../models/ordersModel.js");
const configDB = require('../config/sequelizeConfig');
const qs = require('qs');

const Master = mastersModel(configDB.connectOption, configDB.dataType);
const Order = ordersModel(configDB.connectOption, configDB.dataType);

exports.index = function(req, res){
  Master.findAll()
  .catch(err=>res.send(err))
  .then((result)=>{
    const infoObj = qs.parse(req.params.infoObj);
    let mastersArrByTown = result.filter(item=>{
      let townsArr = item.towns.split(',');
      if(townsArr.includes(infoObj.town)){
        return true;
      }else{
        return false;
      }
    });
    Order.findAll()
    .catch(err=>res.send(err))
    .then(result=>{
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
      })
      let freeMasters = mastersArrByTown.filter(item=>!bookedMastersIdx.includes(item.id))
      res.send(freeMasters);
    })
  });
}
