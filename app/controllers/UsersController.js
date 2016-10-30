var mongoose = require('mongoose');
var User = require('../models/users');

module.exports = {
  create: function(req, res) {
  	User.find({
      email: req.body.email
    }, function(err, user) {
      if (err) {
        return res.status(500).json({
          message: err
        });
      }
      if (user.length) {
        return res.status(400).json({
          message: 'Email already exists'
        });
      }

      var _user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email
      });

      _user.setPassword(req.body.password);

      _user.save(function(err) {
        if (err) {
          return res.status(500).json({
            message: err
          });
        }
        var token = _user.generateJwt();
        res.json({
          token: token,
          user: _user
        });
      });
    });
  }
};