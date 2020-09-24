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
        describe("given that there password mismatch", ()=>{
            it("return warning message and false success", ()=>{
                return api
                .post("/login")
                .set("Content-Type", "application/json; charset=utf-8")
                .send({...testData, password: "mismatch"})
                .then(res=>{
                    expect(res.body.success).toBe(false);
                    expect(res.status).toBe(400);
                    expect(res.body.msg).toBe("Password mismatch");
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
            });
        });
    });
    describe("POST /signUp", ()=>{
        const testData = {
            email: "test@mail.com",
            name: "Test",
            password: "1234"
        }
        describe("given that there input data is valid", ()=>{
            it("return success message, true success and user info, without password and user add to DB", ()=>{
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
                    userModel
                    .findOne({where: {email: testData.email}})
                    .then(data=>expect(data).not.toBeNull());
                });
            });
        });
        describe("given that there one input field is empty", ()=>{
            it("return warning message and false success", ()=>{
                return api
                .post("/signUp")
                .set("Content-Type", "application/json; charset=utf-8")
                .send({...testData, email: null})
                .then(res=>{
                    expect(res.body.success).toBe(false);
                    expect(res.status).toBe(400);
                    expect(res.body.msg).toBe("Please, fill all fields!");
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
            });
        });
        describe("given that there email field is invlaid", ()=>{
            it("return warning message and false success", ()=>{
                return api
                .post("/signUp")
                .set("Content-Type", "application/json; charset=utf-8")
                .send({...testData, email: "i-n-v-a-l-i-d@test.com"})
                .then(res=>{
                    expect(res.body.success).toBe(false);
                    expect(res.status).toBe(400);
                    expect(res.body.msg).toBe("Invalid email format. Please check your email!");
                });
            });
        });
        describe("given that there email field contains word 'admin'", ()=>{
            it("return warning message, and false success", ()=>{
                return api
                .post("/signUp")
                .set("Content-Type", "application/json; charset=utf-8")
                .send({...testData, email: "iamadmin@test.com"})
                .then(res=>{
                    expect(res.body.success).toBe(false);
                    expect(res.status).toBe(400);
                    expect(res.body.msg).toBe("Your email cannot contain the word 'admin'");
                });
            });
        });
        describe("given that there password field is invalid", ()=>{
            it("return warning message, and false success", ()=>{
                return api
                .post("/signUp")
                .set("Content-Type", "application/json; charset=utf-8")
                .send({...testData, password: "12"})
                .then(res=>{
                    expect(res.body.success).toBe(false);
                    expect(res.status).toBe(400);
                    expect(res.body.msg).toBe("Password must not be less than 4 characters and must not be longer than 16 characters!!!");
                });
            });
        });
        describe("given that there name field is invalid", ()=>{
            it("return warning message, and false success", ()=>{
                return api
                .post("/signUp")
                .set("Content-Type", "application/json; charset=utf-8")
                .send({...testData, name: "Name#1"})
                .then(res=>{
                    expect(res.body.success).toBe(false);
                    expect(res.status).toBe(400);
                    expect(res.body.msg).toBe("String name should:\n1. Not contain numbers\n2. Not be shorter than 3 characters\n3. Not longer than 20 characters\n4. Do not contain Cyrillic characters!");
                });
            });
        });
    });
    describe("POST /adminLogin", ()=>{
        const testData = {
            email: "admin@example.com",
            password: "passwordsecret"
        }
        describe("given that there user is exist and input data is valid", ()=>{
            it("return token and data user which containt email", ()=>{
                return api
                .post("/adminLogin")
                .set("Content-Type", "application/json; charset=utf-8")
                .send(testData)
                .then(res=>{
                    expect(res.status).toBe(200);
                    expect(res.body.token).not.toBeNull();
                    expect(res.body.user.email).toBe(testData.email)
                });
            });
        });
        describe("given that there password mismatch", ()=>{
            it("return warning message and false success", ()=>{
                return api
                .post("/adminLogin")
                .set("Content-Type", "application/json; charset=utf-8")
                .send({...testData, password: "mismatch"})
                .then(res=>{
                    expect(res.body.success).toBe(false);
                    expect(res.status).toBe(400);
                    expect(res.body.msg).toBe("Password mismatch");
                });
            });
        });
        describe("given that there exists user does not have enough rights", ()=>{
            const testData = {
                name: "Test",
                email: "test@test.com",
                password: "1234"
            }
            beforeEach(()=>(
                userModel.create({...testData, role: "user", id: 10})
            ));
            it("return warning message", ()=>{
                return api
                .post("/adminLogin")
                .set("Content-Type", "application/json; charset=utf-8")
                .send({email: testData.email, password: testData.password})
                .then(res=>{
                    expect(res.status).toBe(404);
                    expect(res.body.msg).toBe("User was not found or you don't have enough rights")
                });
            });
        });
        describe("given that there non-exist user", ()=>{
            const testData = {
                email: "test@test.com",
                password: "1234"
            }
            it("return warning message", ()=>{
                return api
                .post("/adminLogin")
                .set("Content-Type", "application/json; charset=utf-8")
                .send(testData)
                .then(res=>{
                    expect(res.status).toBe(404);
                    expect(res.body.msg).toBe("User was not found or you don't have enough rights")
                });
            });
        });
        describe("given that there user is exist and email field is invalid", ()=>{
            it("retrun wraning message and false success", ()=>{
                return api
                .post("/adminLogin")
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
                .post("/adminLogin")
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
    describe("POST /updateUserData", ()=>{
        const testData = {
            email: "admin@example.com",
            name: "admin"
        }
        describe("given that there all data is valid", ()=>{
            it("return success message, true success and updated field in DB", ()=>{
                return api
                .post("/updateUserData")
                .set("Content-Type", "application/json; charset=utf-8")
                .send({...testData, name: "updatedName"})
                .then(res=>{
                    expect(res.status).toBe(200);
                    expect(res.body.msg).toBe("You updated your data");
                    return userModel.findOne({where: {email: testData.email}})
                })
                .then(data=>expect(data.name).toBe("updatedName"));
            });
        });
        describe("given that there user non-exist", ()=>{
            it("return warning message and false success", ()=>{
                return api
                .post("/updateUserData")
                .set("Content-Type", "application/json; charset=utf-8")
                .send({...testData, email: "nonExisted@mail.com"})
                .then(res=>{
                    expect(res.status).toBe(404);
                    expect(res.body.msg).toBe("Such user does not exist");
                    expect(res.body.succes).toBe(false);
                });
            });
        });
        describe("given that there invalid email field", ()=>{
            it("return warning message and false success", ()=>{
                return api
                .post("/updateUserData")
                .set("Content-Type", "application/json; charset=utf-8")
                .send({...testData, email: "ival-id@mail.com."})
                .then(res=>{
                    expect(res.status).toBe(400);
                    expect(res.body.msg).toBe("Invalid email format. Please check your email!");
                    expect(res.body.success).toBe(false);
                });
            });
        });
        describe("given that there invalid name field", ()=>{
            it("return warning message and false success", ()=>{
                return api
                .post("/updateUserData")
                .set("Content-Type", "application/json; charset=utf-8")
                .send({...testData, name: "ivalidName#1"})
                .then(res=>{
                    expect(res.status).toBe(400);
                    expect(res.body.msg).toBe("String name should:\n1. Not contain numbers\n2. Not be shorter than 3 characters\n3. Not longer than 20 characters\n4. Do not contain Cyrillic characters!");
                    expect(res.body.success).toBe(false);
                });
            });
        });
    });
});