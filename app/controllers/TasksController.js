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
    Tasks.findById(req.params.taskId, function(err, task) {

      if (err) {
        return res.status(500).json({
          message: err
        });
      }
      if (!task) {
        return res.status(404).json({
          message: 'Project not found'
        });
      }

      for(var key in req.body) {
        task[key] = req.body[key];
      }

      task.save(function(err) {
        if (err) {
          return res.status(500).json({
            message: err
          });
        }
        res.json({
          data: task,
          message: 'Task successfully updated'
        });
      });
    });
  },
  delete: function(req, res) {
    Tasks.findOne({
      '_id':req.params.taskId,
    }, function(err, task) {
      if (err) {
        return res.status(500).json({
          message: err
        });
      }
      if (!task) {
        return res.status(404).json({
          message: 'Task not found'
        });
      }

      task.remove(function(err) {
        if (err) {
          return res.status(500).json({
            message: err
          });
        }
      })
      .then(function(result) {
        Projects.findOne({tasks: req.params.taskId}, function(err, project) {
          var index = project.tasks.indexOf(req.params.taskId);
          if (index > -1) {
              project.tasks.splice(index, 1);
          }
          project.save(function(err) {
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
      });
    });
  },
};