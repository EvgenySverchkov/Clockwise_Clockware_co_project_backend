require("mysql2/node_modules/iconv-lite").encodingExists("foo");
const request = require('supertest')("http://localhost:9000");
const resetDB = require("../../helpers/resetDB");

const MasterModel = require("../../models/mastersModel");
const TownsModel = require("../../models/townsModel");
const MasterTownsModel = require("../../models/masters_towns");
const OrdersModel = require("../../models/ordersModel");
const UsersModel = require("../../models/usersModel");

const token = require("./token");

describe("Orders requests", ()=>{
    beforeEach(()=>resetDB());
    describe("GET 'all' orders", ()=>{
        const testData = {
            id: 1,
            name: "TEST",
            email: "example@example.com",
            size: "large",
            town: "Dnipro",
            date: "2020-10-10",
            time: "12:00",
            masterId: 1,
            endTime: "15:00"
        }
        beforeEach(()=>{
            return OrdersModel.create(testData);
        })
        describe("work", ()=>{
            it("done", (done)=>{
                request
                .get("/orders")
                .set("Authorization", token)
                .set("Content-Type", "application/json")
                .end((err, res)=>{
                    if(err) return done(err)
                    expect(res.body).toEqual([testData]);
                    expect(res.status).toEqual(200);
                    return done();
                })
            })
        })
    })
    describe("GET 'user\'s' orders", ()=>{
        const email = "admin@example.com";
        const orderTestData = {
            id: 1,
            name: "TEST",
            email: email,
            size: "large",
            town: "Dnipro",
            date: "2020-10-10",
            time: "12:00",
            masterId: 1,
            endTime: "15:00"
        }
        beforeEach(()=>OrdersModel.create(orderTestData));
        describe("works", ()=>{
            it("done", (done)=>{
                UsersModel.findOne({where: {id: 1}})
                .then(data=>{
                    const {email, role, name, id} =  data.dataValues;
                    request
                    .post("/orders/getUserOrders")
                    .send({email, role, name, id})
                    .set("Authorization", token)
                    .set("Content-Type", "application/json")
                    .end((err, res)=>{
                        if(err) return done(err);
                        expect(res.body).toEqual([orderTestData]);
                        expect(res.status).toEqual(200);
                        return done();
                    })
                })
            })
        })
        describe("user without orders", ()=>{
            beforeEach(()=>{
                return UsersModel.create({id: 2, name: "TEST", email: "test@test.com", password:"smth", role:"smth"})
            })
            it("done", (done)=>{
                UsersModel.findOne({where: {id: 2}})
                .then(data=>{
                    const {email, role, name, id} =  data.dataValues;
                    request
                    .post("/orders/getUserOrders")
                    .send({email, role, name, id})
                    .set("Authorization", token)
                    .set("Content-Type", "application/json")
                    .end((err, res)=>{
                        console.log(res.body)
                        if(err) return done(err);
                        expect(res.body).toEqual([]);
                        expect(res.status).toEqual(404);
                        done();
                    })
                })
            })
        })
        describe("empty email field", ()=>{
            it("done", (done)=>{
                UsersModel.findOne({where: {id: 1}})
                .then(data=>{
                    const {email, role, name, id} =  data.dataValues;
                    request
                    .post("/orders/getUserOrders")
                    .send({email: "", role, name, id})
                    .set("Authorization", token)
                    .set("Content-Type", "application/json")
                    .end((err, res)=>{
                        if(err) return done(err);
                        expect(res.body.success).toEqual(false);
                        expect(res.status).toEqual(400);
                        expect(res.body.msg).toEqual("Email field is empty, please fill it in");
                        return done();
                    })
                })
            })
        })
        describe("invalid email format", ()=>{
            it("done", (done)=>{
                UsersModel.findOne({where: {id: 1}})
                .then(data=>{
                    const {email, role, name, id} =  data.dataValues;
                    request
                    .post("/orders/getUserOrders")
                    .send({email: "invalid.com", role, name, id})
                    .set("Authorization", token)
                    .set("Content-Type", "application/json")
                    .end((err, res)=>{
                        if(err) return done(err);
                        expect(res.body.success).toEqual(false);
                        expect(res.status).toEqual(400);
                        expect(res.body.msg).toEqual("Invalid email format. Please check your email!");
                        return done();
                    })
                })
            })
        })
    })

    describe("POST new order", ()=>{
        const testData = {
            id: 1,
            name: "TEST",
            email: "admin@example.com",
            size: "large",
            town: "Dnipro",
            date: "2020-10-10",
            time: "12:00",
            masterId: 1,
            endTime: "15:00"
        }
        describe("work", ()=>{
            function init(){
                return TownsModel.create({id: 1, name: "Dnipro"})
                .then(()=>MasterModel.create({id: 1, name: "TEST", rating: 5}))
            }
            beforeEach(()=>init());
            it("done", (done)=>{
                request
                .post("/orders/post")
                .send(testData)
                .set("Authorization", token)
                .set("Content-Type", "application/json")
                .end((err, res)=>{
                    if(err) return done(err)
                    expect(res.body.payload).toEqual(testData);
                    expect(res.status).toEqual(200);
                    return done();
                })
            })
        })
        describe("empty field", ()=>{
            it("done", (done)=>{
                request
                .post("/orders/post")
                .send({testData, name: ""})
                .set("Authorization", token)
                .set("Content-Type", "application/json")
                .end((err, res)=>{
                    if(err) return done(err)
                    expect(res.body.msg).toEqual("Please, fill all fields!");
                    expect(res.body.success).toEqual(false);
                    expect(res.status).toEqual(400);
                    return done();
                })
            })
        })
        describe("invalid 'name' field", ()=>{
            it("done", (done)=>{
                request
                .post("/orders/post")
                .send({testData, name: "INVALID_TEST_1"})
                .set("Authorization", token)
                .set("Content-Type", "application/json")
                .end((err, res)=>{
                    if(err) return done(err)
                    expect(res.body.msg).toEqual("String name should:\n1. Not contain numbers\n2. Not be shorter than 3 characters\n3. Not longer than 20 characters\n4. Do not contain Cyrillic characters!");
                    expect(res.body.success).toEqual(false);
                    expect(res.status).toEqual(400);
                    return done();
                })
            })
        })
        describe("invalid 'email' field", ()=>{
            it("done", (done)=>{
                request
                .post("/orders/post")
                .send({testData, email: "invalid.com"})
                .set("Authorization", token)
                .set("Content-Type", "application/json")
                .end((err, res)=>{
                    if(err) return done(err)
                    expect(res.body.msg).toEqual("Invalid email format. Please check your email!");
                    expect(res.body.success).toEqual(false);
                    expect(res.status).toEqual(400);
                    return done();
                })
            })
        })
        describe("invalid 'size' field", ()=>{
            it("done", (done)=>{
                request
                .post("/orders/post")
                .send({testData, size: "invalid"})
                .set("Authorization", token)
                .set("Content-Type", "application/json")
                .end((err, res)=>{
                    if(err) return done(err)
                    expect(res.body.msg).toEqual("The size field should only include such values:\n1. small\n2. middle\n3. large");
                    expect(res.body.success).toEqual(false);
                    expect(res.status).toEqual(400);
                    return done();
                })
            })
        })
        describe("invalid 'date' field format", ()=>{
            it("done", (done)=>{
                request
                .post("/orders/post")
                .send({testData, date: "10-10-2021"})
                .set("Authorization", token)
                .set("Content-Type", "application/json")
                .end((err, res)=>{
                    if(err) return done(err)
                    expect(res.body.msg).toEqual("The date must be in the format: yyyy-mm-dd");
                    expect(res.body.success).toEqual(false);
                    expect(res.status).toEqual(400);
                    return done();
                })
            })
        })
        describe("'date' field is less than current date", ()=>{
            const currDate = new Date();
            const newDate = `${currDate.getFullYear()-1}-${("0" + (+currDate.getMonth() + 1)).slice(-2)}-${("0" + currDate.getDate()).slice(-2)}`;
            it("done", (done)=>{
                request
                .post("/orders/post")
                .send({testData, date: newDate})
                .set("Authorization", token)
                .set("Content-Type", "application/json")
                .end((err, res)=>{
                    if(err) return done(err)
                    expect(res.body.msg).toEqual("Date must not be less than or equal to the current date!");
                    expect(res.body.success).toEqual(false);
                    expect(res.status).toEqual(400);
                    return done();
                })
            })
        })
        describe("invalid 'date' field", ()=>{
            it("done", (done)=>{
                request
                .post("/orders/post")
                .send({testData, time: "19:00"})
                .set("Authorization", token)
                .set("Content-Type", "application/json")
                .end((err, res)=>{
                    if(err) return done(err)
                    expect(res.body.msg).toEqual("Time should not be more than 18:00 and less than 09:00");
                    expect(res.body.success).toEqual(false);
                    expect(res.status).toEqual(400);
                    return done();
                })
            })
        })
    })

    describe("PUT order", ()=>{
        const testData = {
            id: 1,
            name: "TEST",
            email: "admin@example.com",
            size: "large",
            town: "Dnipro",
            date: "2020-10-10",
            time: "12:00",
            masterId: 1,
            endTime: "15:00"
        }
        describe("work", ()=>{
            function init(){
                return TownsModel.create({id: 1, name: "Dnipro"})
                .then(()=>MasterModel.create({id: 1, name: "TEST", rating: 5}))
                .then(()=>OrdersModel.create(testData))
            }
            beforeEach(()=>init());
            it("done", (done)=>{
                request
                .put("/orders/put/1")
                .send({...testData, name: "TEST_PUT_DATA"})
                .set("Authorization", token)
                .set("Content-Type", "application/json")
                .end((err, res)=>{
                    if(err) return done(err)
                    expect(res.status).toEqual(200)
                    expect(res.body.msg).toEqual("You update order")
                    expect(res.body.success).toEqual(true);
                    return done();
                })
            })
        })
        describe("empty field", ()=>{
            it("done", (done)=>{
                request
                .post("/orders/post")
                .send({testData, name: ""})
                .set("Authorization", token)
                .set("Content-Type", "application/json")
                .end((err, res)=>{
                    if(err) return done(err)
                    expect(res.body.msg).toEqual("Please, fill all fields!");
                    expect(res.body.success).toEqual(false);
                    expect(res.status).toEqual(400);
                    return done();
                })
            })
        })
        describe("invalid 'name' field", ()=>{
            it("done", (done)=>{
                request
                .post("/orders/post")
                .send({testData, name: "INVALID_TEST_1"})
                .set("Authorization", token)
                .set("Content-Type", "application/json")
                .end((err, res)=>{
                    if(err) return done(err)
                    expect(res.body.msg).toEqual("String name should:\n1. Not contain numbers\n2. Not be shorter than 3 characters\n3. Not longer than 20 characters\n4. Do not contain Cyrillic characters!");
                    expect(res.body.success).toEqual(false);
                    expect(res.status).toEqual(400);
                    return done();
                })
            })
        })
        describe("invalid 'email' field", ()=>{
            it("done", (done)=>{
                request
                .post("/orders/post")
                .send({testData, email: "invalid.com"})
                .set("Authorization", token)
                .set("Content-Type", "application/json")
                .end((err, res)=>{
                    if(err) return done(err)
                    expect(res.body.msg).toEqual("Invalid email format. Please check your email!");
                    expect(res.body.success).toEqual(false);
                    expect(res.status).toEqual(400);
                    return done();
                })
            })
        })
        describe("invalid 'size' field", ()=>{
            it("done", (done)=>{
                request
                .post("/orders/post")
                .send({testData, size: "invalid"})
                .set("Authorization", token)
                .set("Content-Type", "application/json")
                .end((err, res)=>{
                    if(err) return done(err)
                    expect(res.body.msg).toEqual("The size field should only include such values:\n1. small\n2. middle\n3. large");
                    expect(res.body.success).toEqual(false);
                    expect(res.status).toEqual(400);
                    return done();
                })
            })
        })
        describe("invalid 'date' field format", ()=>{
            it("done", (done)=>{
                request
                .post("/orders/post")
                .send({testData, date: "10-10-2021"})
                .set("Authorization", token)
                .set("Content-Type", "application/json")
                .end((err, res)=>{
                    if(err) return done(err)
                    expect(res.body.msg).toEqual("The date must be in the format: yyyy-mm-dd");
                    expect(res.body.success).toEqual(false);
                    expect(res.status).toEqual(400);
                    return done();
                })
            })
        })
        describe("'date' field is less than current date", ()=>{
            const currDate = new Date();
            const newDate = `${currDate.getFullYear()-1}-${("0" + (+currDate.getMonth() + 1)).slice(-2)}-${("0" + currDate.getDate()).slice(-2)}`;
            it("done", (done)=>{
                request
                .post("/orders/post")
                .send({testData, date: newDate})
                .set("Authorization", token)
                .set("Content-Type", "application/json")
                .end((err, res)=>{
                    if(err) return done(err)
                    expect(res.body.msg).toEqual("Date must not be less than or equal to the current date!");
                    expect(res.body.success).toEqual(false);
                    expect(res.status).toEqual(400);
                    return done();
                })
            })
        })
        describe("invalid 'date' field", ()=>{
            it("done", (done)=>{
                request
                .post("/orders/post")
                .send({testData, time: "19:00"})
                .set("Authorization", token)
                .set("Content-Type", "application/json")
                .end((err, res)=>{
                    if(err) return done(err)
                    expect(res.body.msg).toEqual("Time should not be more than 18:00 and less than 09:00");
                    expect(res.body.success).toEqual(false);
                    expect(res.status).toEqual(400);
                    return done();
                })
            })
        })
    })

    describe("DELETE order", ()=>{
        describe("works", ()=>{
            beforeEach(()=>{
                return OrdersModel.create({
                    id: 1,
                    name: "TESTrr",
                    email: "admin@example.com",
                    size: "large",
                    town: "Dnipro",
                    date: "2020-10-10",
                    time: "12:00",
                    masterId: 1,
                    endTime: "15:00"
                })
            })
            it('done', (done)=>{
                const orderId = 1;
                request
                .delete(`/orders/delete/${orderId}`)
                .set("Authorization", token)
                .set("Content-Type", "application/json")
                .end((err, res)=>{
                    if(err) return done(err)
                    expect(res.body.payload).toEqual(orderId);
                    expect(res.body.msg).toEqual("You deleted order");
                    expect(res.body.success).toEqual(true);
                    expect(res.status).toEqual(200);
                    return done();
                })
            })
        })
        describe("no order with defined id", ()=>{
            it('done', (done)=>{
                const orderId = 1;
                request
                .delete(`/orders/delete/${orderId}`)
                .set("Authorization", token)
                .set("Content-Type", "application/json")
                .end((err, res)=>{
                    if(err) return done(err)
                    expect(res.body.msg).toEqual(`Order with id: ${orderId} not found`);
                    expect(res.body.success).toEqual(false);
                    expect(res.status).toEqual(400);
                    return done();
                })
            })
        })
    })
})