const Master = require('../models/mastersModel');
const Order = require("../models/ordersModel.js");
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

class FreeMastersController{
  constructor(masterModel, orderModel){
    this.masterModel = masterModel;
    this.orderModel = orderModel;
    this.index = this.index.bind(this);
  }
  
  index(req, res){
    this.masterModel.findAll({
      where: {
        towns: {
          [Op.like]: `%${req.body.town}%`
        }
      }
    })
    .catch(err=>res.send(err))
    .then((result)=>{
      const infoObj = req.body;
      let mastersArrByTown = result;

      this.orderModel.findAll({
        where: {
          date: infoObj.date,
          [Op.or]: [
            {time: infoObj.timeStart}, 
            {endTime: {[Op.lt]: infoObj.timeEnd}}]
        }
      })
      .then(result=>{
        let bookedMastersIdx = result.map((item)=>item.masterId);
        let freeMasters = mastersArrByTown.filter(item=>!bookedMastersIdx.includes(item.id))
        res.send(freeMasters);
      })
      .catch(err=>console.log(err));
    });
  }
}

module.exports = new FreeMastersController(Master, Order);
