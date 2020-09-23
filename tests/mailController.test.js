const supertest = require("supertest");

const app = require("../server");

describe("POST /send_message", ()=>{
    const api = supertest(app);
    const testData = {
        date: "2021-01-01",
        email: "test@test.com",
        endTime: "14:00",
        id: 1,
        masterId: "1",
        name: "Test",
        size: "large",
        time: "11:00",
        town: "Test"
    }
    it("given that you send data which contains email and info which may be send in message", ()=>{
        return api
        .post("/send_message")
        .send(testData)
        .then(res=>{
            expect(res.status).toBe(200);
        });
    });
    it("given that you send data which don't contains email", ()=>{
        return api
        .post("/send_message")
        .send({...testData, email: null})
        .then(res=>{
            expect(res.status).toBe(400);
        });
    });
});