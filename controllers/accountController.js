const User = require("../models/usersModel");

const SALT = require("../config/salt").salt;
const secret = require("../config/secretKey").secretKey;

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

class AccountController {
  constructor(model) {
    this.model = model;
    this.login = this.login.bind(this);
    this.signUp = this.signUp.bind(this);
    this.adminLogin = this.adminLogin.bind(this);
  }
  comparePassword(password, user) {
    return new Promise((response, reject) => {
      bcrypt.compare(password, user.password, function (err, result) {
        if (err) {
          reject({
            success: false,
            msg: "Error during password verification",
            status: 500,
          });
        }
        if (!result) {
          reject({ success: false, msg: "Password mismatch", status: 400 });
        } else {
          const token = jwt.sign(user.toJSON(), secret, {
            expiresIn: 3600 * 24,
          });
          response({
            success: true,
            status: 200,
            token: token,
            user: {
              id: user.id,
              email: user.email,
              role: user.role,
            },
          });
        }
      });
    });
  }
  login(req, res) {
    const { email, password } = req.body;
    if(!email.match(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/)){
      res.status(400).send({ success: false, msg: "The email format is incorrect. Check it out please!"});
      return false;
    }
    if(password.length < 4 || password.length > 45){
      res.status(400).send({ success: false, msg: "Password must not be less than 4 characters and must not be longer than 16 characters!!!" });
      return false;
    }
    this.model
      .findOne({ where: { email: email } })
      .then((user) => {
        if (!user) {
          return Promise.reject({ msg: "User was not found", status: 404 });
        } else {
          return this.comparePassword(password, user);
        }
      })
      .then((data) => {
        res.status(data.status).send(data);
      })
      .catch((err) => {
        res.status(err.status).send(err);
      });
  }
  signUp(req, res) {
    const infoObj = req.body;
    for(let key in infoObj){
      if(!infoObj[key]){
        res.status(400).send({ success: false, msg: "Filling all gaps!!" });
        return false;
      }
      switch(key){
        case "email":
          if(!infoObj[key].match(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/)){
            res.status(400).send({ success: false, msg: "The format of your email is incorrect, please check it!!!" });
            return false;
          }
          if(infoObj[key].toLowerCase().match(/admin/)){
            res.status(400).send({ success: false, msg: "Your email cannot contain the word 'admin'" });
            return false;
          }
          break;
        case "password":
          if(infoObj[key].length < 4 || infoObj[key].length > 45){
            res.status(400).send({ success: false, msg: "Password must not be less than 4 characters and must not be longer than 16 characters!!!" });
            return false;
          }
          break;
      }
    }
    this.model
      .findOne({
        where: {
          email: infoObj.email,
        },
      })
      .then((data) => {
        if (data) {
          return Promise.reject({
            success: false,
            msg: "A user with this email is already registered",
            status: 400,
          });
        } else {
          return this.model.findOne({
            where: {
              email: infoObj.email,
            },
          });
        }
      })
      .then((data) => {
        if (data) {
          return Promise.reject({
            success: false,
            msg: "A user with this email is already registered",
            status: 400,
          });
        } else {
          infoObj.role = "user";
          return infoObj;
        }
      })
      .then((data) => {
        function bcryptHashCallBack(err, hash) {
          let newObj = { ...data, password: hash };
          if (err) {
            res
              .status(500)
              .send({
                success: false,
                msg: "Error during password verification",
                error: err,
              });
          }
          this.model
            .create(newObj)
            .then((data) => {
              res.status(200).send({
                success: true,
                msg: "You have successfully registered",
                user: {
                  email: data.dataValues.email,
                  name: data.dataValues.name,
                },
              });
            })
            .catch((err) => res.status(500).send({ success: false, msg: err }));
        }
        bcrypt.hash(data.password, SALT, bcryptHashCallBack.bind(this));
      })
      .catch((data) => res.status(data.status || 500).send(data));
  }
  adminLogin(req, res) {
    const { email, password } = req.body;
    if(!email.match(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/)){
      res.status(400).send({ success: false, msg: "The email format is incorrect. Check it out please!"});
      return false;
    }
    if(password.length < 4 || password.length > 45){
      res.status(400).send({ success: false, msg: "Password must not be less than 4 characters and must not be longer than 16 characters!!!" });
      return false;
    }
    this.model
      .findOne({ where: { email: email } })
      .then((user) => {
        if (!user || user.role !== "admin") {
          return Promise.reject({
            msg: "User was not found or you don't have enough rights",
            status: 404,
          });
        } else {
          return this.comparePassword(password, user);
        }
      })
      .then((data) => {
        res.status(data.status).send(data);
      })
      .catch((err) => {
        res.status(err.status).send(err);
      });
  }
}

module.exports = new AccountController(User);
