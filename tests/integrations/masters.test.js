require("mysql2/node_modules/iconv-lite").encodingExists("foo");
const request = require('supertest')("http://localhost:9000");

const MasterModel = require("../../models/mastersModel");
const TownsModel = require("../../models/townsModel");
const MasterTownsModel = require("../../models/masters_towns");
const OrdersModel = require("../../models/ordersModel");

function resetDB(){
  return (
    MasterTownsModel
    .truncate()
    .then(()=>MasterModel.destroy({where:{}}))
    .then(()=>TownsModel.destroy({where:{}}))
    .then(()=>OrdersModel.destroy({where: {}}))
  );
}

describe("Master requests", ()=>{
  beforeEach(()=>{
    return resetDB();
  });
  const token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6ImFkbWluIiwiZW1haWwiOiJhZG1pbkBleGFtcGxlLmNvbSIsInBhc3N3b3JkIjoiJDJiJDEwJDNWR1gvZUJGNEIyQWU5OEwuZGlteXVnc250ZU1sTk1CUUJVRjIzaVN3THExbE5ITnFvT1FpIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNTk5Mjk5MjEwLCJleHAiOjE1OTkzODU2MTB9.zh1fVmhESwU-KAcPSt74Y6gPwrCkT_VuRGV3-OqT_JM";
  
  describe("GET 'free' masters", ()=>{
    const currDate = new Date();
    const newDate = `${currDate.getFullYear()+1}-${("0" + (+currDate.getMonth() + 1)).slice(-2)}-${("0" + currDate.getDate()).slice(-2)}`;
    const timeStart = "12:00";
    const timeEnd = "15:00";
    const town = "Dnipro";
    function init(){
      MasterModel.belongsToMany(TownsModel, { through: MasterTownsModel });
      TownsModel.belongsToMany(MasterModel, { through: MasterTownsModel });
  
      MasterTownsModel.sync({ alert: true })
      .then(()=>{
        return TownsModel.create({id: 1, name: "Dnipro"})
      })
      .then((townField) => {
        return MasterModel.create({ id: 1, name: "TEST", rating: 5, towns: "Dnipro" }).then((master) => {
          return master.addTownsname(townField);
        });
      })
      .then(()=>(
        OrdersModel
        .create(
          {
            id: 1, 
            name: "TEST", 
            email: 'test@test.com', 
            size: 'large',
            town: town,
            date: "2020-10-10",
            time: timeStart,
            masterId: 1,
            endTime: timeEnd
          }
        ))
      )
    }
    beforeEach(()=>{return init()})
    describe("works", ()=>{
      it("done", (done)=>{
        request
        .post("/masters")
        .send({date: "2020-10-10", timeStart: timeStart, timeEnd: timeEnd, town: "Dnipro"})
        .set("Authorization", token)
        .set("Content-Type", "application/json")
        .set("include", "free")
        .end((err, res)=>{
          console.log(res)
          if(err) return done(err);
          expect(res.body.payload).toEqual([{id: 1, name: "TEST", rating: 5, towns: "Dnipro"}])
          done();
        })
      })
    })
  })


  describe("GET 'all' masters", ()=>{
    describe("works", ()=>{
      beforeEach(()=> {return MasterModel.create({id: 1, name: "TEST", rating: 5})});
      it("done", (done)=>{
        request
        .post('/masters')
        .send({})
        .set("Authorization", token)
        .set("Content-Type", "application/json")
        .set("include", "all")
        .end(function(err, res){
          if(err) return done(err);
          expect(res.body).toEqual([{id: 1, name: "TEST", rating: 5, towns: ""}]);
          expect(res.status).toEqual(200);
          done();
        })
      })
    })
    describe("if table is empty", ()=>{
      it("done", (done)=>{
        request
        .post('/masters')
        .send({})
        .set("Authorization", token)
        .set("Content-Type", "application/json")
        .set("include", "all")
        .end(function(err, res){
          if(err) return done(err);
          expect(res.body).toEqual([]);
          expect(res.status).toEqual(200);
          done();
        })
      })
    })
  })
  describe("POST new master", ()=>{
    beforeEach(()=>TownsModel.create({id: 1, name: "Dnipro"}));
    it("works", (done)=>{
      request
      .post("/masters/post")
      .send({id: 1, name: "TEST", rating: 5, towns: "Dnipro"})
      .set("Authorization", token)
      .set("Content-Type", "application/json; charset=utf-8")
      .end((err, res)=>{
        if(err) return done(err);
        expect(res.body.payload).toEqual({id: 1, name: "TEST", rating: 5});
        expect(res.status).toEqual(200);
        done();
      })
    });
    it("if invalid name field", (done)=>{
      request
      .post("/masters/post")
      .send({id: 1, name: "TEST1", rating: 5, towns: "Dnipro"})
      .set("Authorization", token)
      .set("Content-Type", "application/json; charset=utf-8")
      .end((err, res)=>{
        if(err) return done(err);
        expect(res.body.msg).toEqual("String name should:\n1. Not contain numbers\n2. Not be shorter than 3 characters\n3. Not longer than 20 characters\n4. Do not contain Cyrillic characters!");
        expect(res.status).toEqual(400);
        done();
      })
    })
    it("if invalid rating field", (done)=>{
      request
      .post("/masters/post")
      .send({id: 1, name: "TEST", rating: 6, towns: "Dnipro"})
      .set("Authorization", token)
      .set("Content-Type", "application/json; charset=utf-8")
      .end((err, res)=>{
        if(err) return done(err);
        expect(res.body.msg).toEqual("Rating value must be from 1 to 5 inclusive");
        expect(res.status).toEqual(400);
        done();
      })
    })
  })
  describe("PUT master", ()=>{
    function init(){
      return TownsModel.create({id: 1, name: "Dnipro"})
      .then(()=>{
        return MasterModel.create({id: 1, name: "TEST", rating: 5, towns: "Dnipro"});
      })
    }
    beforeEach(()=>init());
    it("work", (done)=>{
      request
      .put("/masters/put/1")
      .send({id: 1, name: "TEST_UPDATE_DATA", rating: 5, towns: "Dnipro"})
      .set("Authorization", token)
      .set("Content-Type", "application/json")
      .end((err, res)=>{
        if(err) return done(err);
        expect(res.body.payload).toEqual({id: 1, name: "TEST_UPDATE_DATA", rating: 5, townsnames: []});
        expect(res.status).toEqual(200);
        done();
      })
    })
    it("if invalid name field", (done)=>{
      request
      .post("/masters/post")
      .send({id: 1, name: "TEST1", rating: 5, towns: "Dnipro"})
      .set("Authorization", token)
      .set("Content-Type", "application/json; charset=utf-8")
      .end((err, res)=>{
        if(err) return done(err);
        expect(res.body.msg).toEqual("String name should:\n1. Not contain numbers\n2. Not be shorter than 3 characters\n3. Not longer than 20 characters\n4. Do not contain Cyrillic characters!");
        expect(res.status).toEqual(400);
        done();
      })
    })
    it("if invalid rating field", (done)=>{
      request
      .post("/masters/post")
      .send({id: 1, name: "TEST", rating: 6, towns: "Dnipro"})
      .set("Authorization", token)
      .set("Content-Type", "application/json; charset=utf-8")
      .end((err, res)=>{
        if(err) return done(err);
        expect(res.body.msg).toEqual("Rating value must be from 1 to 5 inclusive");
        expect(res.status).toEqual(400);
        done();
      })
    })
  })
  describe("DELETE master", ()=>{
    beforeEach(()=>MasterModel.create({id: 1, name: "TEST", rating: 5}))
    it("work", (done)=>{
      request
      .delete("/masters/delete/1")
      .set("Authorization", token)
      .end((err,res)=>{
        if(err) return done(err);
        expect(res.body.payload).toEqual(1);
        expect(res.status).toEqual(200);
        done();
      })
    })
    it("non-existent master", (done)=>{
      const id = 2;
      request
      .delete(`/masters/delete/${id}`)
      .set("Authorization", token)
      .end((err,res)=>{
        if(err) return done(err);
        expect(res.body.msg).toEqual(`Master with id: ${id} not found`);
        expect(res.status).toEqual(400);
        done();
      })
    })
  })
});