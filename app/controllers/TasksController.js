var mongoose = require('mongoose');
var Projects = require('../models/projects');
var Tasks = require('../models/tasks');

module.exports = {
  create: function(req, res) {
      var task = new Tasks({
        title: req.body.title
      });

      Projects.findOne({
        '_id': req.body.projectId,
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
        project.tasks.push(task._id);
        project.save()
        .then(function(project) {
          task.save();
          res.json({
            data: task,
            message: 'Task successfully created'
          });
        })
        .catch(function(err) {
          if (err) {
            return res.status(500).json({
              message: err
            });
          }
        })
      });
  },
  edit: function(req, res) {
    Projects.findOne({
      '_id': req.params.projectId,
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

      project.tasks.push(task._id);

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
  },
  delete: function(req, res) {
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

      project.remove(function(err) {
        if (err) {
          return res.status(500).json({
            message: err
          });
        }
        res.json({
          message: 'Project successfully removed'
        });
      });
    });
  },
};