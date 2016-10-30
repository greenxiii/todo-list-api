var User = require('../models/users');
var passport = require('passport');

module.exports = {
  login: function(req, res) {
    passport.authenticate('local', function(err, user, info) {
      var token;
      if (err) {
        return res.status(404).json({
          message: err
        });
      }

      if (user) {
        token = user.generateJwt();
        res.json({
          token: token,
          user: user
        });
      } else {
        res.status(401).json({
          message: info
        });
      }
    })(req, res);
  },
  facebookLogin: function(req, res) {
  },
  googleLogin: function(req, res) {
 }
};