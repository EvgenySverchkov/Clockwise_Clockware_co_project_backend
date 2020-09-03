require("mysql2/node_modules/iconv-lite").encodingExists("foo");
const { connectOption } = require("../config/sequelizeConfig");
const MasterModel = require("../models/mastersModel");
const TownsModel = require("../models/townsModel");

describe("Associations test", () => {
  describe("getAssociations", () => {
    this.Master = MasterModel;
    this.Town = TownsModel;

    this.Master.belongsToMany(this.Town, { through: "newMasterTowns" });
    this.Town.belongsToMany(this.Master, { through: "newMasterTowns" });

    connectOption.sync({ force: true }).then(() => console.log("OK"));

    it("Test #1", () => {
      console.log("Hello");
    });
  });
});
