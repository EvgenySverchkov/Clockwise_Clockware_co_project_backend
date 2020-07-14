const User = require('../models/usersModel');

const uniqueId = require('../helpers/createUniqueId');
const SALT = require("../config/salt").salt;
const secret = require('../config/secretKey').secretKey;

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

exports.login = function(req, res){
  const {login, password} = req.body;
  User.findOne({where: {login: login}})
  .catch(err=>res.send(err))
  .then(user=>{
    if(!user){
      res.send({msg: "Пользователь был не найден"})
    }
    bcrypt.compare(password, user.password, function(err, result) {
      if(err){
        res.send(err);
      }
      if(!result){
        res.send({success: false, msg: "Пароли не совпадают", err: err})
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
exports.signUp = function(req, res){
  let infoObj = req.body;
  User.findOne({where: {login: infoObj.login}})
  .then(data=>{
    if(data){
      res.send({success: false, msg: "Пользователь с таким логином уже зарегестрирован"});
    }else{
      User.findAll().then(data=>{
        infoObj.id = uniqueId.create(data);
        infoObj.role = 'user';
        return infoObj;
      }).then((data)=>{
        bcrypt.hash(infoObj.password, SALT, function(err, hash) {
          let newObj = {...infoObj, password: hash};
          User.create(newObj)
          .then(data=>res.send({success: true, msg: "Вы успешно зарегестрировались", user: {
            login: newObj.login,
            name: newObj.name,
            id: newObj.id
          }}))
          .catch(err=>res.send(err));
        });
      })
    }
  });
}

exports.adminLogin = function(req, res){
  const {login, password} = req.body;
  User.findOne({where: {login: login}})
  .catch(err=>res.send(err))
  .then(user=>{
    if(!user){
      res.send({msg: "Пользователь был не найден"})
    }
    bcrypt.compare(password, user.password, function(err, result) {
      if(err){
        res.send(err);
      }
      if(!result){
        res.send({success: false, msg: "Пароли не совпадают", err: err})
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
