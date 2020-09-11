require("mysql2/node_modules/iconv-lite").encodingExists("foo");
const supertest = require("supertest");
const resetDB = require("../../helpers/resetDB");

const MasterModel = require("../../models/mastersModel");
const TownsModel = require("../../models/townsModel");
const OrdersModel = require("../../models/ordersModel");
const UsersModel = require("../../models/usersModel");
const {connectOption} = require("../../config/sequelizeConfig");

const app = require("../../server");

describe("Orders requests", () => {
  afterAll((done)=>{
    connectOption.close();
    done();
  })
  const api = supertest(app);
  beforeEach(() => resetDB());
  const testData = {
    id: 1,
    name: "TEST",
    email: "admin@example.com",
    size: "large",
    town: "Dnipro",
    date: "2020-10-10",
    time: "12:00",
    masterId: 1,
    endTime: "15:00",
  };
  describe("GET 'all' orders", () => {
    beforeEach(() => {
      return OrdersModel.create(testData);
    });
    describe("work", () => {
      it("done", (done) => {
        api
          .get("/orders")
          .set("Content-Type", "application/json")
          .end((err, res) => {
            if (err) return done(err);
            expect(res.body).toEqual([testData]);
            expect(res.status).toEqual(200);
            return done();
          });
      });
    });
  });

  describe("GET 'user's' orders", () => {
    const email = "admin@example.com";
    const orderTestData = { ...testData, email: email };
    beforeEach(() => OrdersModel.create(orderTestData));
    describe("works", () => {
      it("done", (done) => {
        UsersModel.findOne({ where: { id: 1 } }).then((data) => {
          const { email, role, name, id } = data.dataValues;
          api
            .post("/orders/getUserOrders")
            .send({ email, role, name, id })
            .set("Content-Type", "application/json")
            .end((err, res) => {
              if (err) return done(err);
              expect(res.body).toEqual([orderTestData]);
              expect(res.status).toEqual(200);
              return done();
            });
        });
      });
    });
    describe("user without orders", () => {
      beforeEach(() => {
        return UsersModel.create({
          id: 2,
          name: "TEST",
          email: "test@test.com",
          password: "smth",
          role: "smth",
        });
      });
      it("done", (done) => {
        UsersModel.findOne({ where: { id: 2 } }).then((data) => {
          const { email, role, name, id } = data.dataValues;
          api
            .post("/orders/getUserOrders")
            .send({ email, role, name, id })
            .set("Content-Type", "application/json")
            .end((err, res) => {
              if (err) return done(err);
              expect(res.body).toEqual([]);
              expect(res.status).toEqual(404);
              done();
            });
        });
      });
    });
    describe("empty email field", () => {
      it("done", (done) => {
        UsersModel.findOne({ where: { id: 1 } }).then((data) => {
          const { email, role, name, id } = data.dataValues;
          api
            .post("/orders/getUserOrders")
            .send({ email: "", role, name, id })
            .set("Content-Type", "application/json")
            .end((err, res) => {
              if (err) return done(err);
              expect(res.body.success).toEqual(false);
              expect(res.status).toEqual(400);
              expect(res.body.msg).toEqual(
                "Email field is empty, please fill it in"
              );
              return done();
            });
        });
      });
    });
    describe("invalid email format", () => {
      it("done", (done) => {
        UsersModel.findOne({ where: { id: 1 } }).then((data) => {
          const { email, role, name, id } = data.dataValues;
          api
            .post("/orders/getUserOrders")
            .send({ email: "invalid.com", role, name, id })
            .set("Content-Type", "application/json")
            .end((err, res) => {
              if (err) return done(err);
              expect(res.body.success).toEqual(false);
              expect(res.status).toEqual(400);
              expect(res.body.msg).toEqual(
                "Invalid email format. Please check your email!"
              );
              return done();
            });
        });
      });
    });
  });

  describe("POST new order", () => {
    function init() {
      return TownsModel.create({ id: 1, name: testData.town }).then(() =>
        MasterModel.create({ id: testData.masterId, name: "TEST", rating: 5 })
      );
    }
    describe("work", () => {
      beforeEach(() => init());
      it("done", (done) => {
        api
          .post("/orders/post")
          .send(testData)
          .set("Content-Type", "application/json")
          .end((err, res) => {
            if (err) return done(err);
            expect(res.body.payload).toEqual(testData);
            expect(res.status).toEqual(200);
            return done();
          });
      });
    });
    describe("master with define id not-exist", () => {
      beforeEach(() => init());
      it("done", (done) => {
        api
          .post("/orders/post")
          .send({ ...testData, masterId: 2 })
          .set("Content-Type", "application/json")
          .end((err, res) => {
            if (err) return done(err);
            expect(res.body.msg).toEqual(`Master with id ${2} was not found`);
            expect(res.status).toEqual(400);
            return done();
          });
      });
    });
    describe("town with define name not-exist", () => {
      beforeEach(() => init());
      it("done", (done) => {
        api
          .post("/orders/post")
          .send({ ...testData, town: "Nonexist" })
          .set("Content-Type", "application/json")
          .end((err, res) => {
            if (err) return done(err);
            expect(res.body.msg).toEqual("Town not found");
            expect(res.status).toEqual(400);
            return done();
          });
      });
    });
    describe("empty field", () => {
      it("done", (done) => {
        api
          .post("/orders/post")
          .send({ ...testData, name: "" })
          .set("Content-Type", "application/json")
          .end((err, res) => {
            if (err) return done(err);
            expect(res.body.msg).toEqual("Please, fill all fields!");
            expect(res.body.success).toEqual(false);
            expect(res.status).toEqual(400);
            return done();
          });
      });
    });
    describe("invalid 'name' field", () => {
      it("done", (done) => {
        api
          .post("/orders/post")
          .send({ ...testData, name: "INVALID_TEST_1" })
          .set("Content-Type", "application/json")
          .end((err, res) => {
            if (err) return done(err);
            expect(res.body.msg).toEqual(
              "String name should:\n1. Not contain numbers\n2. Not be shorter than 3 characters\n3. Not longer than 20 characters\n4. Do not contain Cyrillic characters!"
            );
            expect(res.body.success).toEqual(false);
            expect(res.status).toEqual(400);
            return done();
          });
      });
    });
    describe("invalid 'email' field", () => {
      it("done", (done) => {
        api
          .post("/orders/post")
          .send({ ...testData, email: "invalid.com" })
          .set("Content-Type", "application/json")
          .end((err, res) => {
            if (err) return done(err);
            expect(res.body.msg).toEqual(
              "Invalid email format. Please check your email!"
            );
            expect(res.body.success).toEqual(false);
            expect(res.status).toEqual(400);
            return done();
          });
      });
    });
    describe("invalid 'size' field", () => {
      it("done", (done) => {
        api
          .post("/orders/post")
          .send({ ...testData, size: "invalid" })
          .set("Content-Type", "application/json")
          .end((err, res) => {
            if (err) return done(err);
            expect(res.body.msg).toEqual(
              "The size field should only include such values:\n1. small\n2. middle\n3. large"
            );
            expect(res.body.success).toEqual(false);
            expect(res.status).toEqual(400);
            return done();
          });
      });
    });
    describe("invalid 'date' field format", () => {
      it("done", (done) => {
        api
          .post("/orders/post")
          .send({ ...testData, date: "10-10-2021" })
          .set("Content-Type", "application/json")
          .end((err, res) => {
            if (err) return done(err);
            expect(res.body.msg).toEqual(
              "The date must be in the format: yyyy-mm-dd"
            );
            expect(res.body.success).toEqual(false);
            expect(res.status).toEqual(400);
            return done();
          });
      });
    });
    describe("'date' field is less than current date", () => {
      const currDate = new Date();
      const newDate = `${currDate.getFullYear() - 1}-${(
        "0" +
        (+currDate.getMonth() + 1)
      ).slice(-2)}-${("0" + currDate.getDate()).slice(-2)}`;
      it("done", (done) => {
        api
          .post("/orders/post")
          .send({ ...testData, date: newDate })
          .set("Content-Type", "application/json")
          .end((err, res) => {
            if (err) return done(err);
            expect(res.body.msg).toEqual(
              "Date must not be less than or equal to the current date!"
            );
            expect(res.body.success).toEqual(false);
            expect(res.status).toEqual(400);
            return done();
          });
      });
    });
    describe("invalid 'date' field", () => {
      it("done", (done) => {
        api
          .post("/orders/post")
          .send({ ...testData, time: "19:00" })
          .set("Content-Type", "application/json")
          .end((err, res) => {
            if (err) return done(err);
            expect(res.body.msg).toEqual(
              "Time should not be more than 18:00 and less than 09:00"
            );
            expect(res.body.success).toEqual(false);
            expect(res.status).toEqual(400);
            return done();
          });
      });
    });
  });

  describe("PUT order", () => {
    function init() {
      return TownsModel.create({ id: 1, name: testData.town })
        .then(() =>
          MasterModel.create({ id: testData.masterId, name: "TEST", rating: 5 })
        )
        .then(() => OrdersModel.create(testData));
    }
    describe("work", () => {
      beforeEach(() => init());
      it("done", (done) => {
        api
          .put(`/orders/put/${testData.id}`)
          .send(testData)
          .set("Content-Type", "application/json")
          .end((err, res) => {
            if (err) return done(err);
            expect(res.status).toEqual(200);
            expect(res.body.msg).toEqual("You update order");
            expect(res.body.success).toEqual(true);
            done();
          });
      });
    });
    describe("master with define id non-exist", () => {
      beforeEach(() => init());
      it("done", (done) => {
        api
          .put(`/orders/put/${testData.id}`)
          .send({ ...testData, masterId: 128 })
          .set("Content-Type", "application/json")
          .end((err, res) => {
            if (err) return done(err);
            expect(res.status).toEqual(404);
            expect(res.body.msg).toEqual(`Master with id ${128} not found!`);
            expect(res.body.success).toEqual(false);
            done();
          });
      });
    });
    describe("town with define name non-exist", () => {
      beforeEach(() => init());
      it("done", (done) => {
        api
          .put(`/orders/put/${testData.id}`)
          .send({ ...testData, town: "Non-exist" })
          .set("Content-Type", "application/json")
          .end((err, res) => {
            if (err) return done(err);
            expect(res.status).toEqual(404);
            expect(res.body.msg).toEqual(
              `Town with name ${"Non-exist"} not found!`
            );
            expect(res.body.success).toEqual(false);
            done();
          });
      });
    });
    describe("empty field", () => {
      it("done", (done) => {
        api
          .put(`/orders/put/${testData.id}`)
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
    describe("invalid 'name' field", () => {
      it("done", (done) => {
        api
          .put(`/orders/put/${testData.id}`)
          .send({ ...testData, name: "INVALID_TEST_1" })
          .set("Content-Type", "application/json")
          .end((err, res) => {
            if (err) return done(err);
            expect(res.body.msg).toEqual(
              "String name should:\n1. Not contain numbers\n2. Not be shorter than 3 characters\n3. Not longer than 20 characters\n4. Do not contain Cyrillic characters!"
            );
            expect(res.body.success).toEqual(false);
            expect(res.status).toEqual(400);
            return done();
          });
      });
    });
    describe("invalid 'email' field", () => {
      it("done", (done) => {
        api
          .put(`/orders/put/${testData.id}`)
          .send({ ...testData, email: "invalid.com" })
          .set("Content-Type", "application/json")
          .end((err, res) => {
            if (err) return done(err);
            expect(res.body.msg).toEqual(
              "Invalid email format. Please check your email!"
            );
            expect(res.body.success).toEqual(false);
            expect(res.status).toEqual(400);
            return done();
          });
      });
    });
    describe("invalid 'size' field", () => {
      it("done", (done) => {
        api
          .put(`/orders/put/${testData.id}`)
          .send({ ...testData, size: "invalid" })
          .set("Content-Type", "application/json")
          .end((err, res) => {
            if (err) return done(err);
            expect(res.body.msg).toEqual(
              "The size field should only include such values:\n1. small\n2. middle\n3. large"
            );
            expect(res.body.success).toEqual(false);
            expect(res.status).toEqual(400);
            return done();
          });
      });
    });
    describe("invalid 'date' field format", () => {
      it("done", (done) => {
        api
          .put(`/orders/put/${testData.id}`)
          .send({ ...testData, date: "10-10-2021" })
          .set("Content-Type", "application/json")
          .end((err, res) => {
            if (err) return done(err);
            expect(res.body.msg).toEqual(
              "The date must be in the format: yyyy-mm-dd"
            );
            expect(res.body.success).toEqual(false);
            expect(res.status).toEqual(400);
            return done();
          });
      });
    });
    describe("'date' field is less than current date", () => {
      const currDate = new Date();
      const newDate = `${currDate.getFullYear() - 1}-${(
        "0" +
        (+currDate.getMonth() + 1)
      ).slice(-2)}-${("0" + currDate.getDate()).slice(-2)}`;
      it("done", (done) => {
        api
          .put(`/orders/put/${testData.id}`)
          .send({ ...testData, date: newDate })
          .set("Content-Type", "application/json")
          .end((err, res) => {
            if (err) return done(err);
            expect(res.body.msg).toEqual(
              "Date must not be less than or equal to the current date!"
            );
            expect(res.body.success).toEqual(false);
            expect(res.status).toEqual(400);
            return done();
          });
      });
    });
    describe("invalid 'date' field", () => {
      it("done", (done) => {
        api
          .put(`/orders/put/${testData.id}`)
          .send({ ...testData, time: "19:00" })
          .set("Content-Type", "application/json")
          .end((err, res) => {
            if (err) return done(err);
            expect(res.body.msg).toEqual(
              "Time should not be more than 18:00 and less than 09:00"
            );
            expect(res.body.success).toEqual(false);
            expect(res.status).toEqual(400);
            return done();
          });
      });
    });
  });

  describe("DELETE order", () => {
    describe("works", () => {
      beforeEach(() => {
        return OrdersModel.create({
          id: 1,
          name: "TESTrr",
          email: "admin@example.com",
          size: "large",
          town: "Dnipro",
          date: "2020-10-10",
          time: "12:00",
          masterId: 1,
          endTime: "15:00",
        });
      });
      it("done", (done) => {
        const orderId = 1;
        api
          .delete(`/orders/delete/${orderId}`)
          .set("Content-Type", "application/json")
          .end((err, res) => {
            if (err) return done(err);
            expect(res.body.payload).toEqual(orderId);
            expect(res.body.msg).toEqual("You deleted order");
            expect(res.body.success).toEqual(true);
            expect(res.status).toEqual(200);
            return done();
          });
      });
    });
    describe("no order with defined id", () => {
      it("done", (done) => {
        const orderId = 1;
        api
          .delete(`/orders/delete/${orderId}`)
          .set("Content-Type", "application/json")
          .end((err, res) => {
            if (err) return done(err);
            expect(res.body.msg).toEqual(`Order with id: ${orderId} not found`);
            expect(res.body.success).toEqual(false);
            expect(res.status).toEqual(400);
            return done();
          });
      });
    });
  });
});
