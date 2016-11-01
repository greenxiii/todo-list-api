var User = require('../models/users');
var passport = require('passport');
var FB = require('fb');

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
    FB.api('me', {
      fields: ['id', 'first_name', 'last_name', 'email'],
      access_token: req.body.accessToken
    }, function(fbRes) {
      if (fbRes && fbRes.error) {
        return res.status(500).json({
          message: fbRes.error
        });
      }

      if (fbRes.id !== req.body.userID) {
        return res.status(500).json({
          message: 'Invalid Facebook user token'
        });
      }

      User.findOne({
        email: fbRes.email,
        emailVerified: false
      }, function(err, user) {
        if (err) {
          return res.status(500).json({
            message: err
          });
        }

        if (user && !user.emailVerified) {
          return res.status(500).json({
            message: 'User with this email already exists. ' +
                     'Please verify the e-mail address first.'
          });
        }

        User.findOne({
          $or: [
            {'facebookId': req.body.userID},
            {$and: [{'email': fbRes.email, 'emailVerified': true}]}
          ]
        }, function(err, user) {
          if (err) {
            return res.status(500).json({
              message: err
            });
          }

          var created = false;
          if (!user) {
            user = new User({
              firstName: fbRes.first_name,
              lastName: fbRes.last_name,
              socId: req.body.userID,
              email: fbRes.email
            });
            created = true;
          }

          user.facebookId = req.body.userID;

          user.save()
            .then(function(user) {
              var token = user.generateJwt();
              res.json({
                token: token,
                user: user,
                created: created
              });
            })
            .catch(function(err) {
              return res.status(500).json({
                message: err
              });
            });
        });
      });
    });
  }  
};