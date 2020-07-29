const Master = require("../models/mastersModel");
const Order = require("../models/ordersModel.js");
const Town = require("../models/townsModel.js");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

class FreeMastersController {
  constructor(masterModel, orderModel, townModel) {
    this.masterModel = masterModel;
    this.orderModel = orderModel;
    this.townModel = townModel;
    this.index = this.index.bind(this);
  }

  index(req, res) {
    let mastersArrByTown;
    this.townModel
      .findOne({ where: { name: req.body.town } })
      .then((data) => this.masterModel.findAll({ where: { towns: data.id } }))
      .then((result) => {
        if (result.length === 0) {
          return Promise.reject({
            msg: "We don't have masters in this town",
            status: 404,
          });
        } else {
          const infoObj = req.body;
          mastersArrByTown = result;
          console.log(infoObj.timeStart, infoObj.timeEnd);
          return this.orderModel.findAll({
            where: {
              date: infoObj.date,
              [Op.or]: [
                { time: infoObj.timeStart },
                { endTime: { [Op.gte]: infoObj.timeStart } },
              ],
            },
          });
        }
      })
      .then((result) => {
        let bookedMastersIdx = result.map((item) => item.masterId);
        let freeMasters = mastersArrByTown.filter(
          (item) => !bookedMastersIdx.includes(item.id)
        );
        if (freeMasters.length === 0) {
          return Promise.reject({
            msg: "We don't have masters on these date and time",
            status: 404,
          });
        } else {
          return {
            success: true,
            msg: "You got free masters",
            payload: freeMasters,
            status: 200,
          };
        }
      })
      .then((data) => res.status(data.status).send(data))
      .catch((err) => res.status(err.status || 500).send(err));
  }
}

module.exports = new FreeMastersController(Master, Order, Town);
