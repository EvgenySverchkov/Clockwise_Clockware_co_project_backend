const User = require("../models/usersModel");

const SALT = require("../config/salt").salt;
const secret = require("../config/secretKey").secretKey;

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const Sequelize = require("sequelize");
const Op = Sequelize.Op;

class AccountController {
  constructor(model) {
    this.model = model;
    this.login = this.login.bind(this);
    this.signUp = this.signUp.bind(this);
    this.adminLogin = this.adminLogin.bind(this);
    this.signUpGuest = this.signUpGuest.bind(this);
  }
  login(req, res) {
    const { login, password } = req.body;
    this.model
      .findOne({ where: { login: login } })
      .catch((err) => res.send(err))
      .then((user) => {
        if (!user) {
          res.send({ msg: "User was not found" });
        }
        bcrypt.compare(password, user.password, function (err, result) {
          if (err) {
            res.send(err);
          }
          if (!result) {
            res.send({ success: false, msg: "Password mismatch", err: err });
          } else {
            const token = jwt.sign(user.toJSON(), secret, {
              expiresIn: 3600 * 24,
            });
            res.send({
              success: true,
              token: token,
              user: {
                id: user.id,
                login: user.login,
                email: user.email,
                role: user.role
              },
            });
          }
        });
      });
  }
  signUp(req, res) {
    let infoObj = req.body;
    this.model.findOne({
      where: { 
        login: infoObj.login
      } 
    })
    .then((data) => {
      if (data) {
        console.log(data)
        res.send({
          success: false,
          msg: "A user with this username is already registered",
        });
      }else{
        return this.model.findOne({
          where: {
            email: infoObj.email
          }
        })
      }
    })
    .then(data=>{
      if(data){
        res.send({
          success: false,
          msg: "A user with this email is already registered",
        });
      }
    })
    .then(() => {
      infoObj.role = "user";
      return infoObj;
    })
    .then((data) => {
      function bcryptHashCallBack(err, hash) {
        let newObj = { ...data, password: hash };
        this.model
        .create(newObj)
        .then((data) =>
        res.send({
          success: true,
          msg: "You have successfully registered",
          user: {
            login: newObj.login,
            name: newObj.name,
          },
        })
        )
        .catch((err) => res.send(err));
      }
      bcrypt.hash(data.password, SALT, bcryptHashCallBack.bind(this));
    });
  }
  adminLogin(req, res) {
    const { login, password } = req.body;
    this.model
      .findOne({ where: { login: login } })
      .catch((err) => res.send(err))
      .then((user) => {
        if (!user || user.role !== "admin") {
          res.send({
            msg: "User was not found or you don't have enough rights",
          });
        }
        bcrypt.compare(password, user.password, function (err, result) {
          if (err) {
            res.send(err);
          }
          if (!result) {
            res.send({ success: false, msg: "Password mismatch", err: err });
          } else {
            const token = jwt.sign(user.toJSON(), secret, {
              expiresIn: 3600 * 24,
            });
            res.send({
              success: true,
              token: token,
            });
          }
        });
      });
  }
  signUpGuest(req,res){
    let infoObj = req.body;
    this.model.findOne({
      where: {
        email: req.body.email
      }
    })
    .then(data=>{
      if(data){
        res.send({success: false, msg: "You are already registered, please login"});
        return Promise.reject(new Error("fail"));
      }else{
        infoObj = {...infoObj, password: 'password', login: 'login', role: 'guest'}
        return this.model.create(infoObj)
      }
    })
    .then((data)=>{
      console.log("THEN")
      const token = jwt.sign(data.toJSON(), secret, {
        expiresIn: 3600 * 24,
      });
      res.send({
      success: true, 
      msg: "User created",
      token,
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
      }
    })
  }).catch(err=>{throw err})}
}

module.exports = new AccountController(User);
