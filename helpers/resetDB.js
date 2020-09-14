const MasterModel = require("../models/mastersModel");
const TownsModel = require("../models/townsModel");
const MasterTownsModel = require("../models/masters_towns");
const OrdersModel = require("../models/ordersModel");
const UsersModel = require("../models/usersModel");

module.exports = () => Promise.all([
  MasterTownsModel.truncate(),
  MasterModel.destroy({ where: {} }),
  TownsModel.destroy({ where: {} }),
  OrdersModel.destroy({ where: {} }),
  UsersModel.truncate()
])
.then(() =>UsersModel.create({
  id: 1,
  name: "admin",
  password:
    "$2b$10$3VGX/eBF4B2Ae98L.dimyugsnteMlNMBQBUF23iSwLq1lNHNqoOQi",
  role: "admin",
  email: "admin@example.com"
}));