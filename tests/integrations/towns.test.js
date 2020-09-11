require("mysql2/node_modules/iconv-lite").encodingExists("foo");
const supertest = require("supertest");
const resetDB = require("../../helpers/resetDB");

const TownsModel = require("../../models/townsModel");
const {connectOption} = require("../../config/sequelizeConfig");

const app = require("../../server");

describe("Towns requests", () => {
  afterAll((done)=>{
    connectOption.close();
    done();
  });
  const api = supertest(app)
  beforeEach(() => resetDB());
  const testData = { id: 1, name: "Test" };
  describe("GET  towns", () => {
    describe("work", () => {
      beforeEach(() => TownsModel.create(testData));
      it("done", (done) => {
        api
          .get("/towns")
          .set("Content-Type", "application/json")
          .end((err, res) => {
            if (err) return done(err);
            expect(res.body).toEqual([testData]);
            expect(res.status).toEqual(200);
            done();
          });
      });
    });
  });

  describe("POST new town", () => {
    describe("work", () => {
      it("done", (done) => {
        api
          .post("/towns/post")
          .send(testData)
          .set("Content-Type", "application/json")
          .end((err, res) => {
            if (err) return done(err);
            expect(res.body.payload).toEqual(testData);
            expect(res.status).toEqual(200);
            expect(res.body.msg).toEqual("You added town");
            done();
          });
      });
    });
    describe("town already exist", () => {
      beforeEach(() => TownsModel.create(testData));
      it("done", (done) => {
        api
          .post("/towns/post")
          .send(testData)
          .set("Content-Type", "application/json")
          .end((err, res) => {
            if (err) return done(err);
            expect(res.body.msg).toEqual(
              "The name of this town is already on the list!"
            );
            expect(res.body.success).toEqual(false);
            expect(res.status).toEqual(400);
            done();
          });
      });
    });
    describe("empty field", () => {
      it("done", (done) => {
        api
          .post("/towns/post")
          .send({ ...testData, name: "" })
          .set("Content-Type", "application/json")
          .end((err, res) => {
            if (err) return done(err);
            expect(res.body.msg).toEqual("Please, fill all fields!");
            expect(res.body.success).toEqual(false);
            expect(res.status).toEqual(400);
            done();
          });
      });
    });
    describe("name don't start with capital letter", () => {
      it("done", (done) => {
        api
          .post("/towns/post")
          .send({ ...testData, name: "test" })
          .set("Content-Type", "application/json")
          .end((err, res) => {
            if (err) return done(err);
            expect(res.body.msg).toEqual(
              "The string name must start with capital letter"
            );
            expect(res.body.success).toEqual(false);
            expect(res.status).toEqual(400);
            done();
          });
      });
    });
    describe("name field containt number", () => {
      it("done", (done) => {
        api
          .post("/towns/post")
          .send({ ...testData, name: "Test1" })
          .set("Content-Type", "application/json")
          .end((err, res) => {
            if (err) return done(err);
            expect(res.body.msg).toEqual(
              "The string name must not contain numbers!"
            );
            expect(res.body.success).toEqual(false);
            expect(res.status).toEqual(400);
            done();
          });
      });
    });
  });

  describe("PUT town", () => {
    describe("works", () => {
      beforeEach(() => TownsModel.create(testData));
      it("done", (done) => {
        api
          .put(`/towns/put/${testData.id}`)
          .send({ ...testData, name: "Updtest" })
          .set("Content-Type", "application/json")
          .end((err, res) => {
            if (err) return done(err);
            expect(res.body.payload).toEqual([1]);
            expect(res.body.msg).toEqual("You updated town");
            expect(res.body.success).toEqual(true);
            expect(res.status).toEqual(200);
            return done();
          });
      });
    });
    describe("town already exist", () => {
      beforeEach(() => TownsModel.create(testData));
      it("done", (done) => {
        api
          .put(`/towns/put/${testData.id}`)
          .send(testData)
          .set("Content-Type", "application/json")
          .end((err, res) => {
            if (err) return done(err);
            expect(res.body.msg).toEqual(
              "The name of this town is already on the list!!"
            );
            expect(res.body.success).toEqual(false);
            expect(res.status).toEqual(400);
            done();
          });
      });
    });
    describe("empty field", () => {
      it("done", (done) => {
        api
          .put(`/towns/put/${testData.id}`)
          .send({ ...testData, name: "" })
          .set("Content-Type", "application/json")
          .end((err, res) => {
            if (err) return done(err);
            expect(res.body.msg).toEqual("Please, fill all fields!");
            expect(res.body.success).toEqual(false);
            expect(res.status).toEqual(400);
            done();
          });
      });
    });
    describe("name don't start with capital letter", () => {
      it("done", (done) => {
        api
          .put(`/towns/put/${testData.id}`)
          .send({ ...testData, name: "test" })
          .set("Content-Type", "application/json")
          .end((err, res) => {
            if (err) return done(err);
            expect(res.body.msg).toEqual(
              "The string name must start with capital letter"
            );
            expect(res.body.success).toEqual(false);
            expect(res.status).toEqual(400);
            done();
          });
      });
    });
    describe("name field containt number", () => {
      it("done", (done) => {
        api
          .put(`/towns/put/${testData.id}`)
          .send({ ...testData, name: "Test1" })
          .set("Content-Type", "application/json")
          .end((err, res) => {
            if (err) return done(err);
            expect(res.body.msg).toEqual(
              "The string name must not contain numbers!"
            );
            expect(res.body.success).toEqual(false);
            expect(res.status).toEqual(400);
            done();
          });
      });
    });
  });

  describe("DELETE town", () => {
    describe("work", () => {
      beforeEach(() => TownsModel.create(testData));
      it("done", (done) => {
        api
          .delete(`/towns/delete/${testData.id}`)
          .set("Content-Type", "application/json")
          .end((err, res) => {
            if (err) return done(err);
            expect(res.body.payload).toEqual(testData.id);
            expect(res.body.msg).toEqual("You deleted town");
            expect(res.body.success).toEqual(true);
            expect(res.status).toEqual(200);
            done();
          });
      });
    });
    describe("non-exist town", () => {
      it("done", (done) => {
        api
          .delete(`/towns/delete/${1}`)
          .set("Content-Type", "application/json")
          .end((err, res) => {
            if (err) return done(err);
            expect(res.body.msg).toEqual(`Town with id: ${1} not found`);
            expect(res.body.success).toEqual(false);
            expect(res.status).toEqual(400);
            done();
          });
      });
    });
  });
});
