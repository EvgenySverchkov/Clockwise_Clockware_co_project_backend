require("mysql2/node_modules/iconv-lite").encodingExists("foo");
const app = require("../../server");
const supertest = require("supertest");
const resetDB = require("../../helpers/resetDB");

const MasterModel = require("../../models/mastersModel");
const TownsModel = require("../../models/townsModel");
const MasterTownsModel = require("../../models/masters_towns");
const OrdersModel = require("../../models/ordersModel");

describe("Master requests", () => {
  const api = supertest(app);
  beforeEach(() => {
    return resetDB();
  });
  describe("GET 'all' masters", () => {
    describe("given that there is one master in all towns", () => {
      beforeEach(() => {
        return MasterModel.create({ id: 1, name: "TEST", rating: 5 });
      });
      it("return all masters", () => {
        return api
          .post("/masters")
          .send({})
          .set("Content-Type", "application/json")
          .set("include", "all")
          .then((res)=>{
            expect(res.body).toEqual([
              { id: 1, name: "TEST", rating: 5, towns: "" },
            ]);
            expect(res.status).toEqual(200);
          });
        });
      });
    describe("given that there no masters", () => {
      it("return empty arrray", () => {
        return api
          .post("/masters")
          .send({})
          .set("Content-Type", "application/json")
          .set("include", "all")
          .then((res)=>{
            expect(res.body).toEqual([]);
            expect(res.status).toEqual(200);
          });
        });
      });
    describe("given that there no include field in headers", () => {
        it("return warning message and false success", ()=>{
          return api
            .post("/masters")
            .send({})
            .set("Content-Type", "application/json")
            .then(res=>{
              expect(res.status).toBe(400);
              expect(res.body.success).toBe(false);
              expect(res.body.msg).toBe("You must provide a value field with a value of 'all' or 'free'");
            });
        });
      });
  });

  describe.only("GET 'free' masters", () => {
    const currDate = new Date();
    const newDate = `${currDate.getFullYear() + 1}-${(
      "0" +
      (+currDate.getMonth() + 1)
    ).slice(-2)}-${("0" + currDate.getDate()).slice(-2)}`;
    let timeStart = "13:00";
    let timeEnd = "16:00";
    const town = "Dnipro";
    const masterTestData = {id: 1,name: "TEST",rating: 5}
    describe("given that there is one master in 'Dnipro' and one orders of this master", () => {
      function init() {
        MasterModel.belongsToMany(TownsModel, { through: MasterTownsModel });
        TownsModel.belongsToMany(MasterModel, { through: MasterTownsModel });
  
        return MasterTownsModel.sync({ alert: true })
          .then(() => {
            return TownsModel.create({ id: 1, name: "Dnipro" });
          })
          .then((townField) => {
            return MasterModel.create(masterTestData).then((master) => {
              return master.addTownsname(townField);
            });
          })
          .then(() =>
            OrdersModel.create({
              id: 1,
              name: "TEST",
              email: "test@test.com",
              size: "large",
              town: town,
              date: newDate,
              time: "09:00",
              masterId: 1,
              endTime: "12:00",
            })
          );
      }
      beforeEach(() => {
        return init();
      });
      it("return free masters", () => {
        return api
          .post("/masters")
          .send({
            date: newDate,
            timeStart,
            timeEnd,
            town,
          })
          .set("Content-Type", "application/json")
          .set("include", "free")
          .then((res)=>{
            expect(res.body.payload).toEqual([
              { id: 1, name: "TEST", rating: 5 },
            ]);
          });
      });
    });
    describe("given that there is one master without town and one town", () => {
      function init(){
        return TownsModel.create({ id: 2, name: "Kiyv" })
        .then(()=>MasterModel.create(masterTestData))
      }
      beforeEach(()=>init())
      it("return only error message", () => {
        return api
        .post("/masters")
        .send({
          date: newDate,
          timeStart,
          timeEnd,
          town: "Kiyv",
        })
        .set("Content-Type", "application/json")
        .set("include", "free")
        .then((res) => {
          expect(res.body.msg).toEqual("We don't have masters in this town");
          expect(res.status).toEqual(404);
        });
      });
    });
    describe("given that there is one master with town and one town but he is booked on define date and time", ()=>{
      function init() {
        MasterModel.belongsToMany(TownsModel, { through: MasterTownsModel });
        TownsModel.belongsToMany(MasterModel, { through: MasterTownsModel });
  
        return MasterTownsModel.sync({ alert: true })
          .then(() => {
            return TownsModel.create({ id: 1, name: "Dnipro" });
          })
          .then((townField) => {
            return MasterModel.create({...masterTestData}).then((master) => {
              return master.addTownsname(townField);
            });
          })
          .then(() =>
            OrdersModel.create({
              id: 1,
              name: "TEST",
              email: "test@test.com",
              size: "large",
              town: town,
              date: newDate,
              time: "09:00",
              masterId: 1,
              endTime: "12:00",
            })
          );
      }
      beforeEach(()=>init());
      it("return only error message", ()=>{
        return api
        .post("/masters")
        .send({
          date: newDate,
          timeStart: "09:00",
          timeEnd,
          town: "Dnipro",
        })
        .set("Content-Type", "application/json")
        .set("include", "free")
        .then((res) => {
          expect(res.body.msg).toEqual("We don't have masters on these date and time");
          expect(res.status).toEqual(404);
        });
      })
    });
    describe("given that all fields are empty", ()=>{
      it("retun message", ()=>{
        return api
        .post("/masters")
        .send({
          date: "",
          timeStart: "",
          timeEnd: "",
          town: "",
        })
        .set("Content-Type", "application/json")
        .set("include", "free")
        .then((res) => {
          expect(res.body.msg).toEqual("Please, fill all fields!");
          expect(res.body.success).toEqual(false);
          expect(res.status).toEqual(400);
        });
      })
    });
    describe("given that date field is invalid", ()=>{
      it("return only error message", ()=>{
        return api
        .post("/masters")
        .send({
          date: "01-01-2021",
          timeStart,
          timeEnd,
          town,
        })
        .set("Content-Type", "application/json")
        .set("include", "free")
        .then((res) => {
          expect(res.body.msg).toEqual("The date must be in the format: yyyy-mm-dd");
          expect(res.body.success).toEqual(false);
          expect(res.status).toEqual(400);
        });
      })
    });
    describe("given that input date less then current date", ()=>{
      const currDate = new Date();
      const wrongDate = `${currDate.getFullYear() - 1}-${(
        "0" +
        (+currDate.getMonth() + 1)
        ).slice(-2)}-${("0" + currDate.getDate()).slice(-2)}`;
        it("return only error message", ()=>{
          api
          .post("/masters")
          .send({
            date: wrongDate,
            timeStart,
            timeEnd,
            town,
          })
          .set("Content-Type", "application/json")
          .set("include", "free")
          .then((res) => {
            expect(res.body.msg).toEqual("Date must not be less than or equal to the current date!");
            expect(res.body.success).toEqual(false);
            expect(res.status).toEqual(400);
          });
        })
    })
    describe("given that user wants to order at 10, but there's already an order at 12", ()=>{
      function init() {
        MasterModel.belongsToMany(TownsModel, { through: MasterTownsModel });
        TownsModel.belongsToMany(MasterModel, { through: MasterTownsModel });
  
        return MasterTownsModel.sync({ alert: true })
          .then(() => {
            return TownsModel.create({ id: 1, name: "Dnipro" });
          })
          .then((townField) => {
            return MasterModel.create(masterTestData).then((master) => {
              return master.addTownsname(townField);
            });
          })
          .then(() =>
            OrdersModel.create({
              id: 1,
              name: "TEST",
              email: "test@test.com",
              size: "large",
              town: town,
              date: newDate,
              time: "12:00",
              masterId: 1,
              endTime: "15:00",
            })
          );
      }
      beforeEach(()=>{
        return init();
      }) 
      it("should allow to book small clock", ()=>{
        timeStart = "10:00"; 
        timeEnd = "11:00";
        return api
          .post("/masters")
          .send({
            date: newDate,
            timeStart,
            timeEnd,
            town,
          })
          .set("Content-Type", "application/json")
          .set("include", "free")
          .then(res=>{
            expect(res.body.success).toBe(true);
            expect(res.status).toBe(200);
            return MasterModel.findOne({where: {id: 1}})
            .then(data=>{
              expect([data.dataValues]).toEqual(res.body.payload)
            });
          });
      });
      it("should allow to book middle clock", ()=>{
        timeStart = "10:00"; 
        timeEnd = "12:00";
        return api
          .post("/masters")
          .send({
            date: newDate,
            timeStart,
            timeEnd,
            town,
          })
          .set("Content-Type", "application/json")
          .set("include", "free")
          .then(res=>{
            expect(res.body.success).toBe(true);
            expect(res.status).toBe(200);
            return MasterModel.findOne({where: {id: 1}})
            .then(data=>{
              expect([data.dataValues]).toEqual(res.body.payload)
            });
          });
      });
      it("shouldn't allow to book large clock", ()=>{
        timeStart = "10:00"; 
        timeEnd = "13:00";
        return api
          .post("/masters")
          .send({
            date: newDate,
            timeStart,
            timeEnd,
            town,
          })
          .set("Content-Type", "application/json")
          .set("include", "free")
          .then(res=>{
            expect(res.body.msg).toBe("We don't have masters on these date and time");
            expect(res.status).toBe(404);
          });
      });
    });
    describe("given that user wants to order at 11, but there's already an order at 12", ()=>{
      function init() {
        MasterModel.belongsToMany(TownsModel, { through: MasterTownsModel });
        TownsModel.belongsToMany(MasterModel, { through: MasterTownsModel });
  
        return MasterTownsModel.sync({ alert: true })
          .then(() => {
            return TownsModel.create({ id: 1, name: "Dnipro" });
          })
          .then((townField) => {
            return MasterModel.create(masterTestData).then((master) => {
              return master.addTownsname(townField);
            });
          })
          .then(() =>
            OrdersModel.create({
              id: 1,
              name: "TEST",
              email: "test@test.com",
              size: "large",
              town: town,
              date: newDate,
              time: "12:00",
              masterId: 1,
              endTime: "15:00",
            })
          );
      }
      beforeEach(()=>{
        return init();
      });
      it("should allow to book small clock", ()=>{
        timeStart = "11:00"; 
        timeEnd = "12:00";
        return api
          .post("/masters")
          .send({
            date: newDate,
            timeStart,
            timeEnd,
            town,
          })
          .set("Content-Type", "application/json")
          .set("include", "free")
          .then(res=>{
            expect(res.body.success).toBe(true);
            expect(res.status).toBe(200);
            return MasterModel.findOne({where: {id: 1}})
            .then(data=>{
              expect([data.dataValues]).toEqual(res.body.payload)
            });
          });
      });
      it("shouldn't allow to book middle clock", ()=>{
        timeStart = "11:00"; 
        timeEnd = "13:00";
        return api
          .post("/masters")
          .send({
            date: newDate,
            timeStart,
            timeEnd,
            town,
          })
          .set("Content-Type", "application/json")
          .set("include", "free")
          .then(res=>{
            expect(res.body.msg).toBe("We don't have masters on these date and time");
            expect(res.status).toBe(404);
          });
      });
      it("shouldn't not allow to book big clock", ()=>{
        timeStart = "11:00"; 
        timeEnd = "14:00";
        return api
          .post("/masters")
          .send({
            date: newDate,
            timeStart,
            timeEnd,
            town,
          })
          .set("Content-Type", "application/json")
          .set("include", "free")
          .then(res=>{
            expect(res.body.msg).toBe("We don't have masters on these date and time");
            expect(res.status).toBe(404);
          });
      });
    });
    describe("given that user wants to order at 12, but there's already an order at 12 and no free masters", ()=>{
      function init() {
        MasterModel.belongsToMany(TownsModel, { through: MasterTownsModel });
        TownsModel.belongsToMany(MasterModel, { through: MasterTownsModel });
  
        return MasterTownsModel.sync({ alert: true })
          .then(() => {
            return TownsModel.create({ id: 1, name: "Dnipro" });
          })
          .then((townField) => {
            return MasterModel.create(masterTestData).then((master) => {
              return master.addTownsname(townField);
            });
          })
          .then(() =>
            OrdersModel.create({
              id: 1,
              name: "TEST",
              email: "test@test.com",
              size: "large",
              town: town,
              date: newDate,
              time: "12:00",
              masterId: 1,
              endTime: "15:00",
            })
          );
      }
      beforeEach(()=>{
        return init();
      });
      it("should not allow to book small clock", ()=>{
        timeStart = "12:00"; 
        timeEnd = "13:00";
        return api
          .post("/masters")
          .send({
            date: newDate,
            timeStart,
            timeEnd,
            town,
          })
          .set("Content-Type", "application/json")
          .set("include", "free")
          .then(res=>{
            expect(res.body.msg).toBe("We don't have masters on these date and time");
            expect(res.status).toBe(404);
        });
      });
      it("should not allow to book middle clock", ()=>{
        timeStart = "12:00"; 
        timeEnd = "14:00";
        return api
          .post("/masters")
          .send({
            date: newDate,
            timeStart,
            timeEnd,
            town,
          })
          .set("Content-Type", "application/json")
          .set("include", "free")
          .then(res=>{
            expect(res.body.msg).toBe("We don't have masters on these date and time");
            expect(res.status).toBe(404);
        });
      });
      it("should not allow to book big clock", ()=>{
        timeStart = "12:00"; 
        timeEnd = "15:00";
        return api
          .post("/masters")
          .send({
            date: newDate,
            timeStart,
            timeEnd,
            town,
          })
          .set("Content-Type", "application/json")
          .set("include", "free")
          .then(res=>{
            expect(res.body.msg).toBe("We don't have masters on these date and time");
            expect(res.status).toBe(404);
        });
      });
    });
    describe("given that user wants to order at 12:30, but there's already an order at 11:30 for small clock", ()=>{
      function init() {
        MasterModel.belongsToMany(TownsModel, { through: MasterTownsModel });
        TownsModel.belongsToMany(MasterModel, { through: MasterTownsModel });
  
        return MasterTownsModel.sync({ alert: true })
          .then(() => {
            return TownsModel.create({ id: 1, name: "Dnipro" });
          })
          .then((townField) => {
            return MasterModel.create(masterTestData).then((master) => {
              return master.addTownsname(townField);
            });
          })
          .then(() =>
            OrdersModel.create({
              id: 1,
              name: "TEST",
              email: "test@test.com",
              size: "large",
              town: town,
              date: newDate,
              time: "11:30",
              masterId: 1,
              endTime: "12:30",
            })
          );
      }
      beforeEach(()=>{
        return init();
      });
      it("should allow to book small clock", ()=>{
        timeStart = "12:30"; 
        timeEnd = "13:30";
        return api
          .post("/masters")
          .send({
            date: newDate,
            timeStart,
            timeEnd,
            town,
          })
          .set("Content-Type", "application/json")
          .set("include", "free")
          .then(res=>{
            expect(res.body.success).toBe(true);
            expect(res.status).toBe(200);
            return MasterModel.findOne({where: {id: 1}})
            .then(data=>{
              expect([data.dataValues]).toEqual(res.body.payload)
            });
          });
      });
      it("should allow to book middle clock", ()=>{
        timeStart = "12:30"; 
        timeEnd = "14:30";
        return api
          .post("/masters")
          .send({
            date: newDate,
            timeStart,
            timeEnd,
            town,
          })
          .set("Content-Type", "application/json")
          .set("include", "free")
          .then(res=>{
            expect(res.body.success).toBe(true);
            expect(res.status).toBe(200);
            return MasterModel.findOne({where: {id: 1}})
            .then(data=>{
              expect([data.dataValues]).toEqual(res.body.payload)
            });
          });
      });
      it("should allow to book big clock", ()=>{
        timeStart = "12:30"; 
        timeEnd = "15:30";
        return api
          .post("/masters")
          .send({
            date: newDate,
            timeStart,
            timeEnd,
            town,
          })
          .set("Content-Type", "application/json")
          .set("include", "free")
          .then(res=>{
            expect(res.body.success).toBe(true);
            expect(res.status).toBe(200);
            return MasterModel.findOne({where: {id: 1}})
            .then(data=>{
              expect([data.dataValues]).toEqual(res.body.payload)
            });
          });
      });
    });
    describe("given that user wants to order at 14, but there's already an order at 12 for middle clock", ()=>{
      function init() {
        MasterModel.belongsToMany(TownsModel, { through: MasterTownsModel });
        TownsModel.belongsToMany(MasterModel, { through: MasterTownsModel });
  
        return MasterTownsModel.sync({ alert: true })
          .then(() => {
            return TownsModel.create({ id: 1, name: "Dnipro" });
          })
          .then((townField) => {
            return MasterModel.create(masterTestData).then((master) => {
              return master.addTownsname(townField);
            });
          })
          .then(() =>
            OrdersModel.create({
              id: 1,
              name: "TEST",
              email: "test@test.com",
              size: "large",
              town: town,
              date: newDate,
              time: "12:00",
              masterId: 1,
              endTime: "14:00",
            })
          );
      }
      beforeEach(()=>{
        return init();
      });
      it("should allow to book small clock", ()=>{
        timeStart = "14:00"; 
        timeEnd = "15:00";
        return api
          .post("/masters")
          .send({
            date: newDate,
            timeStart,
            timeEnd,
            town,
          })
          .set("Content-Type", "application/json")
          .set("include", "free")
          .then(res=>{
            expect(res.body.success).toBe(true);
            expect(res.status).toBe(200);
            return MasterModel.findOne({where: {id: 1}})
            .then(data=>{
              expect([data.dataValues]).toEqual(res.body.payload)
            });
          });
      });
      it("should allow to book middle clock", ()=>{
        timeStart = "14:00"; 
        timeEnd = "16:00";
        return api
          .post("/masters")
          .send({
            date: newDate,
            timeStart,
            timeEnd,
            town,
          })
          .set("Content-Type", "application/json")
          .set("include", "free")
          .then(res=>{
            expect(res.body.success).toBe(true);
            expect(res.status).toBe(200);
            return MasterModel.findOne({where: {id: 1}})
            .then(data=>{
              expect([data.dataValues]).toEqual(res.body.payload)
            });
          });
      });
      it("should allow to book big clock", ()=>{
        timeStart = "14:00"; 
        timeEnd = "17:00";
        return api
          .post("/masters")
          .send({
            date: newDate,
            timeStart,
            timeEnd,
            town,
          })
          .set("Content-Type", "application/json")
          .set("include", "free")
          .then(res=>{
            expect(res.body.success).toBe(true);
            expect(res.status).toBe(200);
            return MasterModel.findOne({where: {id: 1}})
            .then(data=>{
              expect([data.dataValues]).toEqual(res.body.payload)
            });
          });
      });
    });
    describe("given that user wants to order at 15:00, but there's already an order at 12 for big clock", ()=>{
      function init() {
        MasterModel.belongsToMany(TownsModel, { through: MasterTownsModel });
        TownsModel.belongsToMany(MasterModel, { through: MasterTownsModel });
  
        return MasterTownsModel.sync({ alert: true })
          .then(() => {
            return TownsModel.create({ id: 1, name: "Dnipro" });
          })
          .then((townField) => {
            return MasterModel.create(masterTestData).then((master) => {
              return master.addTownsname(townField);
            });
          })
          .then(() =>
            OrdersModel.create({
              id: 1,
              name: "TEST",
              email: "test@test.com",
              size: "large",
              town: town,
              date: newDate,
              time: "12:00",
              masterId: 1,
              endTime: "15:00",
            })
          );
      }
      beforeEach(()=>{
        return init();
      });
      it("should allow to book small clock", ()=>{
        timeStart = "15:00"; 
        timeEnd = "16:00";
        return api
          .post("/masters")
          .send({
            date: newDate,
            timeStart,
            timeEnd,
            town,
          })
          .set("Content-Type", "application/json")
          .set("include", "free")
          .then(res=>{
            expect(res.body.success).toBe(true);
            expect(res.status).toBe(200);
            return MasterModel.findOne({where: {id: 1}})
            .then(data=>{
              expect([data.dataValues]).toEqual(res.body.payload)
            });
          });
      });
      it("should allow to book middle clock", ()=>{
        timeStart = "15:00"; 
        timeEnd = "17:00";
        return api
          .post("/masters")
          .send({
            date: newDate,
            timeStart,
            timeEnd,
            town,
          })
          .set("Content-Type", "application/json")
          .set("include", "free")
          .then(res=>{
            expect(res.body.success).toBe(true);
            expect(res.status).toBe(200);
            return MasterModel.findOne({where: {id: 1}})
            .then(data=>{
              expect([data.dataValues]).toEqual(res.body.payload)
            });
          });
      });
      it("should allow to book big clock", ()=>{
        timeStart = "15:00"; 
        timeEnd = "18:00";
        return api
          .post("/masters")
          .send({
            date: newDate,
            timeStart,
            timeEnd,
            town,
          })
          .set("Content-Type", "application/json")
          .set("include", "free")
          .then(res=>{
            expect(res.body.success).toBe(true);
            expect(res.status).toBe(200);
            return MasterModel.findOne({where: {id: 1}})
            .then(data=>{
              expect([data.dataValues]).toEqual(res.body.payload)
            });
          });
      });
    });
  });

  describe("POST /masters/post", () => {
    beforeEach(() => TownsModel.create({ id: 1, name: "Dnipro" }));
    describe("given that there are no masters", ()=>{
      it("return posted master", () => {
        return api
          .post("/masters/post")
          .send({ id: 1, name: "TEST", rating: 5, towns: "Dnipro" })
          .set("Content-Type", "application/json; charset=utf-8")
          .then((res) => {
            expect(res.body.payload).toEqual({ id: 1, name: "TEST", rating: 5 });
            expect(res.status).toEqual(200);
          });
      });
    });
    describe("given that name field is invalid", ()=>{
      it("no added master and  return error message", () => {
        return api
          .post("/masters/post")
          .send({ id: 1, name: "TEST1", rating: 5, towns: "Dnipro" })
          .set("Content-Type", "application/json; charset=utf-8")
          .then((res) => {
            expect(res.body.msg).toEqual(
              "String name should:\n1. Not contain numbers\n2. Not be shorter than 3 characters\n3. Not longer than 20 characters\n4. Do not contain Cyrillic characters!"
            );
            expect(res.status).toEqual(400);
            return MasterModel.findOne({where: {id: 1}})
          })
          .then(data=>expect(data).toEqual(null));
      });
    });
    describe("given that rating field is invalid", ()=>{
      it("no added master and return error message", () => {
        return api
          .post("/masters/post")
          .send({ id: 1, name: "TEST", rating: 6, towns: "Dnipro" })
          .set("Content-Type", "application/json; charset=utf-8")
          .then((res) => {
            expect(res.body.msg).toEqual(
              "Rating value must be from 1 to 5 inclusive"
            );
            expect(res.status).toEqual(400);
            return MasterModel.findOne({where: {id: 1}})
          })
          .then(data=>expect(data).toEqual(null));
      });
    })
  });

  describe("PUT /masters/put/:id", () => {
    function init() {
      return TownsModel.create({ id: 1, name: "Dnipro" }).then(() => {
        return MasterModel.create({
          id: 1,
          name: "TEST",
          rating: 5,
          towns: "Dnipro",
        });
      });
    }
    beforeEach(() => init());
    describe("given that there are one master", ()=>{
      it("retrun updated master", () => {
        return api
          .put("/masters/put/1")
          .send({ id: 1, name: "TEST_UPDATE_DATA", rating: 5, towns: "Dnipro" })
          .set("Content-Type", "application/json")
          .then((res) => {
            expect(res.body.payload).toEqual({
              id: 1,
              name: "TEST_UPDATE_DATA",
              rating: 5,
              townsnames: [],
            });
            expect(res.status).toEqual(200);
          });
      });
    });
    describe("given that name field is invalid", ()=>{
      it("no updated master and return error message", () => {
        return api
          .put("/masters/put/1")
          .send({ id: 1, name: "TEST1", rating: 5, towns: "Dnipro" })
          .set("Content-Type", "application/json; charset=utf-8")
          .then((res) => {
            expect(res.body.msg).toEqual(
              "String name should:\n1. Not contain numbers\n2. Not be shorter than 3 characters\n3. Not longer than 20 characters\n4. Do not contain Cyrillic characters!"
            );
            expect(res.status).toEqual(400);
            return MasterModel.findOne({where: {id: 1}})
          })
          .then(data=>expect(data.dataValues).toEqual({
            id: 1,
            name: "TEST",
            rating: 5,
          }));
      });
    });
    describe("given that rating field is invalid", ()=>{
      it("no updated master and return error message", () => {
        return api
          .put("/masters/put/1")
          .send({ id: 1, name: "TEST", rating: 6, towns: "Dnipro" })
          .set("Content-Type", "application/json; charset=utf-8")
          .then((res) => {
            expect(res.body.msg).toEqual(
              "Rating value must be from 1 to 5 inclusive"
            );
            expect(res.status).toEqual(400);
            return MasterModel.findOne({where: {id: 1}})
          })
          .then(data=>expect(data.dataValues).toEqual({
            id: 1,
            name: "TEST",
            rating: 5,
          }));
      });
    });
  });

  describe("DELETE /masters/delete/:id", () => {
    beforeEach(() => MasterModel.create({ id: 1, name: "TEST", rating: 5 }));
    describe("given that there are one master", ()=>{
      it("retrun id of deleted master", () => {
        return api
          .delete("/masters/delete/1")
          .then((res) => {
            expect(res.body.payload).toEqual(1);
            expect(res.status).toEqual(200);
          });
      });
    });
    describe("given that there are no masters", ()=>{
      it("return error message", () => {
        const id = 2;
        return api
          .delete(`/masters/delete/${id}`)
          .then((res) => {
            expect(res.body.msg).toEqual(`Master with id: ${id} not found`);
            expect(res.status).toEqual(400);
          });
      });
    });
  });
});
