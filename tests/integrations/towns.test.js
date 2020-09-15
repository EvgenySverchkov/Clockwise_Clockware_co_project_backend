require("mysql2/node_modules/iconv-lite").encodingExists("foo");
const supertest = require("supertest");
const resetDB = require("../../helpers/resetDB");

const TownsModel = require("../../models/townsModel");
const app = require("../../server");

describe("Towns requests", () => {
  const api = supertest(app)
  beforeEach(() => resetDB());
  const testData = { id: 1, name: "Test" };
  describe("GET /towns", () => {
    describe("given that there are one town", () => {
      beforeEach(() => TownsModel.create(testData));
      it("retrun all towns", () => {
        return api
          .get("/towns")
          .set("Content-Type", "application/json")
          .then((res) => {
            expect(res.body).toEqual([testData]);
            expect(res.status).toEqual(200);
          });
      });
    });
  });

  describe("POST /towns/post", () => {
    describe("given that there are no towns", () => {
      it("retrun posted town and message", () => {
        return api
          .post("/towns/post")
          .send(testData)
          .set("Content-Type", "application/json")
          .then((res) => {
            expect(res.body.payload).toEqual(testData);
            expect(res.status).toEqual(200);
            expect(res.body.msg).toEqual("You added town");
          });
      });
    });
    describe("given that there are one town with the same name", () => {
      beforeEach(() => TownsModel.create(testData));
      it("retrun message", () => {
        return api
          .post("/towns/post")
          .send(testData)
          .set("Content-Type", "application/json")
          .then((res) => {
            expect(res.body.msg).toEqual(
              "The name of this town is already on the list!"
            );
            expect(res.body.success).toEqual(false);
            expect(res.status).toEqual(400);
          });
      });
    });
    describe("given that one input field is empty", () => {
      it("return message", () => {
        return api
          .post("/towns/post")
          .send({ ...testData, name: "" })
          .set("Content-Type", "application/json")
          .then((res) => {
            expect(res.body.msg).toEqual("Please, fill all fields!");
            expect(res.body.success).toEqual(false);
            expect(res.status).toEqual(400);
          });
      });
    });
    describe("given that town name field start with capital letter", () => {
      it("return message", () => {
        return api
          .post("/towns/post")
          .send({ ...testData, name: "test" })
          .set("Content-Type", "application/json")
          .then((res) => {
            expect(res.body.msg).toEqual(
              "The string name must start with capital letter"
            );
            expect(res.body.success).toEqual(false);
            expect(res.status).toEqual(400);
          });
      });
    });
    describe("given that town name field containt number", () => {
      it("retrun message", () => {
        return api
          .post("/towns/post")
          .send({ ...testData, name: "Test1" })
          .set("Content-Type", "application/json")
          .then((res) => {
            expect(res.body.msg).toEqual(
              "The string name must not contain numbers!"
            );
            expect(res.body.success).toEqual(false);
            expect(res.status).toEqual(400);
          });
      });
    });
  });

  describe("PUT /towns/put/:id", () => {
    describe("given that there are one town", () => {
      beforeEach(() => TownsModel.create(testData));
      it("return array [1] and message", () => {
        return api
          .put(`/towns/put/${testData.id}`)
          .send({ ...testData, name: "Updtest" })
          .set("Content-Type", "application/json")
          .then((res) => {
            expect(res.body.payload).toEqual([1]);
            expect(res.body.msg).toEqual("You updated town");
            expect(res.body.success).toEqual(true);
            expect(res.status).toEqual(200);
          });
      });
    });
    describe("given that there are one town with the same name", () => {
      beforeEach(() => TownsModel.create(testData));
      it("return message", () => {
        return api
          .put(`/towns/put/${testData.id}`)
          .send(testData)
          .set("Content-Type", "application/json")
          .then((res) => {
            expect(res.body.msg).toEqual(
              "The name of this town is already on the list!!"
            );
            expect(res.body.success).toEqual(false);
            expect(res.status).toEqual(400);
          });
      });
    });
    describe("given that one input field is empty", () => {
      it("return message", () => {
        return api
          .put(`/towns/put/${testData.id}`)
          .send({ ...testData, name: "" })
          .set("Content-Type", "application/json")
          .then((res) => {
            expect(res.body.msg).toEqual("Please, fill all fields!");
            expect(res.body.success).toEqual(false);
            expect(res.status).toEqual(400);
          });
      });
    });
    describe("given that town name field start with capital letter", () => {
      it("return message", () => {
        return api
          .put(`/towns/put/${testData.id}`)
          .send({ ...testData, name: "test" })
          .set("Content-Type", "application/json")
          .then((res) => {
            expect(res.body.msg).toEqual(
              "The string name must start with capital letter"
            );
            expect(res.body.success).toEqual(false);
            expect(res.status).toEqual(400);
          });
      });
    });
    describe("given that town name field start with capital letter", () => {
      it("return message", () => {
        return api
          .put(`/towns/put/${testData.id}`)
          .send({ ...testData, name: "Test1" })
          .set("Content-Type", "application/json")
          .then((res) => {
            expect(res.body.msg).toEqual(
              "The string name must not contain numbers!"
            );
            expect(res.body.success).toEqual(false);
            expect(res.status).toEqual(400);
          });
      });
    });
  });

  describe("DELETE /towns/delete/:id", () => {
    describe("given that there are one town", () => {
      beforeEach(() => TownsModel.create(testData));
      it("retrun id of deleted town", () => {
        return api
          .delete(`/towns/delete/${testData.id}`)
          .set("Content-Type", "application/json")
          .then((res) => {
            expect(res.body.payload).toEqual(testData.id);
            expect(res.body.msg).toEqual("You deleted town");
            expect(res.body.success).toEqual(true);
            expect(res.status).toEqual(200);
          });
      });
    });
    describe("given that there no towns", () => {
      it("retrun message", () => {
        return api
          .delete(`/towns/delete/${1}`)
          .set("Content-Type", "application/json")
          .then((res) => {
            expect(res.body.msg).toEqual(`Town with id: ${1} not found`);
            expect(res.body.success).toEqual(false);
            expect(res.status).toEqual(400);
          });
      });
    });
  });
});
