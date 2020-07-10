const secret = require('./secretKey').secretKey;
var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
const configDB = require('../config/sequelizeConfig');
const passport = require("passport");

const usersModel = require('../models/usersModel');
const User = usersModel(configDB.connectOption, configDB.dataType);

module.exports = function(passport){
  var opts = {}
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  opts.secretOrKey = secret; ///////////////////Secret key///////////////////
  // opts.issuer = 'accounts.examplesoft.com';
  // opts.audience = 'yoursite.net';
  passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
      User.findOne({where: {id: jwt_payload.id}})
      .then(user=>done(null, user))
      .catch(err=>done(err, null));
  }));
}
