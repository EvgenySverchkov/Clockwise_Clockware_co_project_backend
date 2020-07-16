const User = require('../models/usersModel');

const SALT = require("../config/salt").salt;
const secret = require('../config/secretKey').secretKey;

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

class AccountController{
  constructor(model){
    this.model = model;
    this.login = this.login.bind(this);
    this.signUp = this.signUp.bind(this);
    this.adminLogin = this.adminLogin.bind(this);
  }
  login(req, res){
    const {login, password} = req.body;
    this.model.findOne({where: {login: login}})
    .catch(err=>res.send(err))
    .then(user=>{
      if(!user){
        res.send({msg: "User was not found"})
      }
      bcrypt.compare(password, user.password, function(err, result) {
        if(err){
          res.send(err);
        }
        if(!result){
          res.send({success: false, msg: "Password mismatch", err: err})
        }else{
          const token = jwt.sign(user.toJSON(), secret, {
            expiresIn: 3600 * 24
          });
          res.send({
            success: true,
            token: 'JWT ' + token,
            user: {
              id: user.id,
              login: user.login,
              email: user.email
            }
          });
        }
      })
    })
  }
  signUp(req, res){
    let infoObj = req.body;
    this.model.findOne({where: {login: infoObj.login}})
    .then(data=>{
      if(data){
        res.send({success: false, msg: "A user with this username is already registered"});
      }else{
        this.model.findAll().then(data=>{
          infoObj.role = 'user';
          return infoObj;
        }).then((data)=>{
          bcrypt.hash(infoObj.password, SALT, function(err, hash) {
            let newObj = {...infoObj, password: hash};
            this.model.create(newObj)
            .then(data=>res.send({success: true, msg: "You have successfully registered", user: {
              login: newObj.login,
              name: newObj.name
            }}))
            .catch(err=>res.send(err));
          });
        })
      }
    });
  }
  adminLogin(req, res){
    const {login, password} = req.body;
    this.model.findOne({where: {login: login}})
    .catch(err=>res.send(err))
    .then(user=>{
      if(!user){
        res.send({msg: "User was not found"})
      }
      bcrypt.compare(password, user.password, function(err, result) {
        if(err){
          res.send(err);
        }
        if(!result){
          res.send({success: false, msg: "Password mismatch", err: err})
        }else{
          const token = jwt.sign(user.toJSON(), secret, {
            expiresIn: 3600 * 24
          });
          res.send({
            success: true,
            token: token,
          });
        }
      })
    })
  }
}

module.exports = new AccountController(User);