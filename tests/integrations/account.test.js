const supertest = require("supertest");
const app = require("../../server");

const userModel = require("../../models/usersModel");
const resetDB = require("../../helpers/resetDB")

describe("Account requests", ()=>{
    beforeEach(()=>{
        return resetDB();
    })
    const api = supertest(app);
    describe("POST /login", ()=>{
        const testData = {
            email: "admin@example.com",
            password: "passwordsecret"
        }
        describe("given that there user is exist and input data is valid", ()=>{
            it("return token and data user which containt email", ()=>{
                return api
                .post("/login")
                .set("Content-Type", "application/json; charset=utf-8")
                .send(testData)
                .then(res=>{
                    expect(res.status).toBe(200);
                    expect(res.body.token).not.toBeNull();
                    expect(res.body.user.email).toBe(testData.email)
                });
            });
        });
        describe("given that there user is no-exist and input data is valid", ()=>{
            it("return warning message", ()=>{
                return api
                .post("/login")
                .set("Content-Type", "application/json; charset=utf-8")
                .send({...testData, email: "nonexist@test.com"})
                .then(res=>{
                    expect(res.status).toBe(404);
                    expect(res.body.msg).toBe("User was not found")
                });
            });
        });
        describe("given that there user is exist and email field is invalid", ()=>{
            it("retrun wraning message and false success", ()=>{
                return api
                .post("/login")
                .set("Content-Type", "application/json; charset=utf-8")
                .send({...testData, email: "invalid@test.com."})
                .then(res=>{
                    expect(res.body.success).toBe(false);
                    expect(res.status).toBe(400);
                    expect(res.body.msg).toBe("Invalid email format. Please check your email!")
                });
            });
        });
        describe("given that there user is exist and password field is invalid", ()=>{
            it("retrun wraning message and false success", ()=>{
                return api
                .post("/login")
                .set("Content-Type", "application/json; charset=utf-8")
                .send({...testData, password: "12"})
                .then(res=>{
                    expect(res.body.success).toBe(false);
                    expect(res.status).toBe(400);
                    expect(res.body.msg).toBe("Password must not be less than 4 characters and must not be longer than 16 characters!")
                });
            })
        })
    });
    describe("POST /signUp", ()=>{
        const testData = {
            email: "test@mail.com",
            name: "Test",
            password: "1234"
        }
        describe("given that there input data valid", ()=>{
            it("return success message, true success and user info, without password", ()=>{
                return api
                .post("/signUp")
                .set("Content-Type", "application/json; charset=utf-8")
                .send(testData)
                .then(res=>{
                    expect(res.body.success).toBe(true);
                    expect(res.status).toBe(200);
                    expect(res.body.msg).toBe("You have successfully registered");
                    expect(res.body.user).toEqual({
                        email: testData.email,
                        name: testData.name
                    });
                });
            });
        });
        describe("given that the user already exists", ()=>{
            const testData = {
                name: "Test",
                email: "test@test.com",
                password: "1234"
            }
            beforeEach(()=>(
                userModel.create({...testData, role: "user", id: 10})
            ));
            it("return warning message and false success", ()=>{
                return api
                .post("/signUp")
                .set("Content-Type", "application/json; charset=utf-8")
                .send(testData)
                .then(res=>{
                    expect(res.body.success).toBe(false);
                    expect(res.status).toBe(400);
                    expect(res.body.msg).toBe("A user with this email is already registered");
                });
            })
        })
    });
});