const User = require("../models/usersModel");

const SALT = +process.env.SALT_FOR_PASSWOR_HASHING;
const secret = process.env.TOKEN_SECRET_KEY;

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const validators = require("../helpers/validators");

class AccountController {
  constructor(model) {
    this.model = model;
    this.login = this.login.bind(this);
    this.signUp = this.signUp.bind(this);
    this.adminLogin = this.adminLogin.bind(this);
    this.updateUserInfo = this.updateUserInfo.bind(this);
  }
  updateUserInfo(req, res) {
    const infoObj = req.body;
    const validationResult = validators.updateUserInfoValidator(infoObj);
    if (!validationResult.success) {
      return res.status(validationResult.status).send(validationResult);
    }
    return this.model
      .findOne({
        where: { email: req.body.email },
      })
      .then((data) => {
        if (data) {
          return this.model.update(req.body, {
            where: { email: req.body.email },
          });
        } else {
          return Promise.reject({
            succes: false,
            msg: "Such user does not exist",
            status: 404
          });
        }
      })
      .then(() =>
        res.status(200).send({ succes: true, msg: "You updated your data" })
      )
      .catch((err) => res.status(err.status||500).send(err));
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
              name: user.name,
            },
          });
        }
      });
    });
  }
  login(req, res) {
    const { email, password } = req.body;
    const validationResult = validators.loginValidator(req.body);
    if (!validationResult.success) {
      return res.status(validationResult.status).send(validationResult);
    }
    return this.model
      .findOne({ where: { email: email } })
      .then((user) => {
        if (!user) {
          return Promise.reject({ msg: "User was not found", status: 404 });
        } else {
          return this.comparePassword(password, user);
        }
      })
      .then((data) => res.status(data.status).send(data))
      .catch((err) => res.status(err.status).send(err));
  }
  signUp(req, res) {
    const infoObj = req.body;
    const validationResult = validators.signUpValidator(infoObj);
    if (!validationResult.success) {
      res.status(validationResult.status).send(validationResult);
      return false;
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
          infoObj.role = "user";
          return infoObj;
        }
      })
      .then((data) => {
        function bcryptHashCallBack(err, hash) {
          let newObj = { ...data, password: hash };
          if (err) {
            return res.status(500).send({
              success: false,
              msg: "Error during password verification",
              error: err,
            });
          }
          return this.model
            .create(newObj)
            .then((data) => (
              res.status(200).send({
                success: true,
                msg: "You have successfully registered",
                user: {
                  email: data.dataValues.email,
                  name: data.dataValues.name,
                },
              })
            ))
            .catch((err) => res.status(500).send({ success: false, msg: err }));
        }
        return bcrypt.hash(data.password, SALT, bcryptHashCallBack.bind(this));
      })
      .catch((data) => res.status(data.status || 500).send(data));
  }
  adminLogin(req, res) {
    const { email, password } = req.body;
    const validationResult = validators.loginValidator(req.body);
    if (!validationResult.success) {
      res.status(validationResult.status).send(validationResult);
      return false;
    }
    return this.model
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
      .then((data) => res.status(data.status).send(data))
      .catch((err) => res.status(err.status).send(err));
  }
}

module.exports = new AccountController(User);
