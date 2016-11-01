var mongoose = require('mongoose');
var Projects = require('../models/projects');

module.exports = {
  create: function(req, res) {
  	Projects.find({
      title: req.body.title
    }, function(err, project) {
      if (err) {
        return res.status(500).json({
          message: err
        });
      }
      if (project.length) {
        return res.status(400).json({
          message: 'Project with such title already exists'
        });
      }

      var _project = new Projects({
        title: req.body.title
      });

      _project.save(function(err) {
        if (err) {
          return res.status(500).json({
            message: err
          });
        }
        res.json({
          data: _project
        });
      });
    });
  }
};