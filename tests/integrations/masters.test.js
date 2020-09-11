require("mysql2/node_modules/iconv-lite").encodingExists("foo");
const app = require("../../server");
const supertest = require("supertest");
const resetDB = require("../../helpers/resetDB");

const MasterModel = require("../../models/mastersModel");
const TownsModel = require("../../models/townsModel");
const MasterTownsModel = require("../../models/masters_towns");
const OrdersModel = require("../../models/ordersModel");

const {connectOption} = require("../../config/sequelizeConfig")

describe("Master requests", () => {
  const api = supertest(app);
  beforeEach(() => {
    return resetDB();
  });
  afterAll((done)=>{
    connectOption.close();
    done();
  })
  describe("GET 'all' masters", () => {
    describe("works", () => {
      beforeEach(() => {
        return MasterModel.create({ id: 1, name: "TEST", rating: 5 });
      });
      it("done", (done) => {
        api
          .post("/masters")
          .send({})
          .set("Content-Type", "application/json")
          .set("include", "all")
          .end(function (err, res) {
            if (err) return done(err);
            expect(res.body).toEqual([
              { id: 1, name: "TEST", rating: 5, towns: "" },
            ]);
            expect(res.status).toEqual(200);
            done();
          });
      });
    });
    describe("if table is empty", () => {
      it("done", (done) => {
        api
          .post("/masters")
          .send({})
          .set("Content-Type", "application/json")
          .set("include", "all")
          .end(function (err, res) {
            if (err) return done(err);
            expect(res.body).toEqual([]);
            expect(res.status).toEqual(200);
            done();
          });
      });
    });
  });

  describe("GET 'free' masters", () => {
    const currDate = new Date();
    const newDate = `${currDate.getFullYear() + 1}-${(
      "0" +
      (+currDate.getMonth() + 1)
    ).slice(-2)}-${("0" + currDate.getDate()).slice(-2)}`;
    const timeStart = "13:00";
    const timeEnd = "16:00";
    const town = "Dnipro";
    const masterTestData = {id: 1,name: "TEST",rating: 5}
    describe("works", () => {
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
      it("done", (done) => {
        api
          .post("/masters")
          .send({
            date: newDate,
            timeStart,
            timeEnd,
            town,
          })
          .set("Content-Type", "application/json")
          .set("include", "free")
          .end((err, res) => {
            if (err) return done(err);
            expect(res.body.payload).toEqual([
              { id: 1, name: "TEST", rating: 5 },
            ]);
            done();
          });
      });
    });
    describe("no masters in define town", () => {
      function init(){
        return TownsModel.create({ id: 2, name: "Kiyv" })
        .then(()=>MasterModel.create(masterTestData))
      }
      beforeEach(()=>init())
      it("done", (done) => {
        api
        .post("/masters")
        .send({
          date: newDate,
          timeStart,
          timeEnd,
          town: "Kiyv",
        })
        .set("Content-Type", "application/json")
        .set("include", "free")
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.msg).toEqual("We don't have masters in this town");
          expect(res.status).toEqual(404);
          done();
        });
      });
    });
    describe("no masters on define date and time", ()=>{
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
      it("done", (done)=>{
        api
        .post("/masters")
        .send({
          date: newDate,
          timeStart: "09:00",
          timeEnd,
          town: "Dnipro",
        })
        .set("Content-Type", "application/json")
        .set("include", "free")
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.msg).toEqual("We don't have masters on these date and time");
          expect(res.status).toEqual(404);
          done();
        });
      })
    });
    describe("empty entrance field", ()=>{
      it("done", (done)=>{
        api
        .post("/masters")
        .send({
          date: "",
          timeStart: "",
          timeEnd: "",
          town: "",
        })
        .set("Content-Type", "application/json")
        .set("include", "free")
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.msg).toEqual("Please, fill all fields!");
          expect(res.body.success).toEqual(false);
          expect(res.status).toEqual(400);
          done();
        });
      })
    });
    describe("invalid date field", ()=>{
      const req = {
        body: {
          date: "01-01-2021",
          town,
          timeStart,
          timeEnd
        }
      }
      it("done", (done)=>{
        api
        .post("/masters")
        .send({
          date: "01-01-2021",
          timeStart,
          timeEnd,
          town,
        })
        .set("Content-Type", "application/json")
        .set("include", "free")
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body.msg).toEqual("The date must be in the format: yyyy-mm-dd");
          expect(res.body.success).toEqual(false);
          expect(res.status).toEqual(400);
          done();
        });
      })
    });
    describe("date less then current date", ()=>{
      const currDate = new Date();
      const wrongDate = `${currDate.getFullYear() - 1}-${(
        "0" +
        (+currDate.getMonth() + 1)
        ).slice(-2)}-${("0" + currDate.getDate()).slice(-2)}`;
        it("done", (done)=>{
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
          .end((err, res) => {
            if (err) return done(err);
            expect(res.body.msg).toEqual("Date must not be less than or equal to the current date!");
            expect(res.body.success).toEqual(false);
            expect(res.status).toEqual(400);
            done();
          });
        })
    })
  });

  describe("POST new master", () => {
    beforeEach(() => TownsModel.create({ id: 1, name: "Dnipro" }));
    describe("works", ()=>{
      it("done", (done) => {
        api
          .post("/masters/post")
          .send({ id: 1, name: "TEST", rating: 5, towns: "Dnipro" })
          .set("Content-Type", "application/json; charset=utf-8")
          .end((err, res) => {
            if (err) return done(err);
            expect(res.body.payload).toEqual({ id: 1, name: "TEST", rating: 5 });
            expect(res.status).toEqual(200);
            done();
          });
      });
    });
    describe("if invalid name field", ()=>{
      it("done", (done) => {
        api
          .post("/masters/post")
          .send({ id: 1, name: "TEST1", rating: 5, towns: "Dnipro" })
          .set("Content-Type", "application/json; charset=utf-8")
          .end((err, res) => {
            if (err) return done(err);
            expect(res.body.msg).toEqual(
              "String name should:\n1. Not contain numbers\n2. Not be shorter than 3 characters\n3. Not longer than 20 characters\n4. Do not contain Cyrillic characters!"
            );
            expect(res.status).toEqual(400);
            done();
          });
      });
    });
    describe("if invalid rating field", ()=>{
      it("if invalid rating field", (done) => {
        api
          .post("/masters/post")
          .send({ id: 1, name: "TEST", rating: 6, towns: "Dnipro" })
          .set("Content-Type", "application/json; charset=utf-8")
          .end((err, res) => {
            if (err) return done(err);
            expect(res.body.msg).toEqual(
              "Rating value must be from 1 to 5 inclusive"
            );
            expect(res.status).toEqual(400);
            done();
          });
      });
    })
  });

  describe("PUT master", () => {
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
    describe("work", ()=>{
      it("done", (done) => {
        api
          .put("/masters/put/1")
          .send({ id: 1, name: "TEST_UPDATE_DATA", rating: 5, towns: "Dnipro" })
          .set("Content-Type", "application/json")
          .end((err, res) => {
            if (err) return done(err);
            expect(res.body.payload).toEqual({
              id: 1,
              name: "TEST_UPDATE_DATA",
              rating: 5,
              townsnames: [],
            });
            expect(res.status).toEqual(200);
            done();
          });
      });
    });
    describe("if invalid name field", ()=>{
      it("done", (done) => {
        api
          .post("/masters/post")
          .send({ id: 1, name: "TEST1", rating: 5, towns: "Dnipro" })
          .set("Content-Type", "application/json; charset=utf-8")
          .end((err, res) => {
            if (err) return done(err);
            expect(res.body.msg).toEqual(
              "String name should:\n1. Not contain numbers\n2. Not be shorter than 3 characters\n3. Not longer than 20 characters\n4. Do not contain Cyrillic characters!"
            );
            expect(res.status).toEqual(400);
            done();
          });
      });
    });
    describe("if invalid rating field", ()=>{
      it("done", (done) => {
        api
          .post("/masters/post")
          .send({ id: 1, name: "TEST", rating: 6, towns: "Dnipro" })
          .set("Content-Type", "application/json; charset=utf-8")
          .end((err, res) => {
            if (err) return done(err);
            expect(res.body.msg).toEqual(
              "Rating value must be from 1 to 5 inclusive"
            );
            expect(res.status).toEqual(400);
            done();
          });
      });
    });
  });

  describe("DELETE master", () => {
    beforeEach(() => MasterModel.create({ id: 1, name: "TEST", rating: 5 }));
    describe("work", ()=>{
      it("done", (done) => {
        api
          .delete("/masters/delete/1")
          .end((err, res) => {
            if (err) return done(err);
            expect(res.body.payload).toEqual(1);
            expect(res.status).toEqual(200);
            done();
          });
      });
    });
    describe("non-existent master", ()=>{
      it("done", (done) => {
        const id = 2;
        api
          .delete(`/masters/delete/${id}`)
          .end((err, res) => {
            if (err) return done(err);
            expect(res.body.msg).toEqual(`Master with id: ${id} not found`);
            expect(res.status).toEqual(400);
            done();
          });
      });
    });
  });
});
