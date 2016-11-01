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
        title: req.body.title,
        user: req.user._id
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
  },
  edit: function(req, res) {
    Projects.findOne({
      '_id':req.params.projectId,
      'user': req.user._id
    }, function(err, project) {
      if (err) {
        return res.status(500).json({
          message: err
        });
      }
      if (!project) {
        return res.status(404).json({
          message: 'Project not found'
        });
      }

      project.set({
        'title': req.body.title
      });

      project.save(function(err) {
        if (err) {
          return res.status(500).json({
            message: err
          });
        }
        res.json({
          data: project,
          message: 'Project successfully updated'
        });
      });
    });
  }
};