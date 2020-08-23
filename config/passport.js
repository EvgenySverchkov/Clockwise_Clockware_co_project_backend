const secret = require("./secretKey").secretKey;
var JwtStrategy = require("passport-jwt").Strategy,
  ExtractJwt = require("passport-jwt").ExtractJwt;
const configDB = require("../config/sequelizeConfig");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const User = require("../models/usersModel");

function myExtracktor(req) {
  const token = req.headers.authorization;
  if (!token) {
    if (
      req.path == "/towns" ||
      (req.path == "/masters" && req.headers.include === "free")
    ) {
      const token = jwt.sign({}, secret, {
        expiresIn: "50d",
      });
      return token;
    }
    if (req.path == "/orders/post") {
      if (req.body.email && req.body.name) {
        const token = jwt.sign({}, secret, {
          expiresIn: "50d",
        });
        return token;
      }
    }
    return null;
  } else {
    return token.split(" ")[1];
  }
}
module.exports = function (passport) {
  var opts = {};
  opts.jwtFromRequest = myExtracktor;
  opts.secretOrKey = secret;
  passport.use(
    new JwtStrategy(opts, function (jwt_payload, done) {
      if (!jwt_payload.id) {
        done(null, {});
        if (jwt_payload.email && jwt_payload.name) {
          done(null, {});
        }
      } else {
        User.findOne({ where: { id: jwt_payload.id } })
          .then((user) => {
            done(null, user);
          })
          .catch((err) => {
            done(err, null);
          });
      }
    })
  );
};
