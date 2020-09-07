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
    })
    describe("POST new order", ()=>{
        describe("work", ()=>{
            function init(){
                return TownsModel.create({id: 1, name: "Dnipro"})
                .then(()=>MasterModel.create({id: 1, name: "TEST", rating: 5}))
            }
            beforeEach(()=>init());
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
    })
    describe("PUT order", ()=>{
        describe("work", ()=>{
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
                    return done();
                })
            })
        })
    })
})