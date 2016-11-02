var request = require('supertest-as-promised');
var app = require('../../server');
var assert = require('assert');
var chai = require('chai');
var mongoose = require('mongoose');
var should = chai.should();

var Projects = require('../../app/models/projects');
var Users = require('../../app/models/users');
var Tasks = require('../../app/models/tasks');

module.exports = function(testData) {
  describe('Tasks Ctrl', function() {
    beforeEach(function(done) {
      Tasks.remove({}, function(err) {
        if (err) {
            done(new Error('Database\'s error during remove tasks'));
          }
      })
      .then(function() {
        Projects.remove({}, function(err) {
          if (err) {
              done(new Error('Database\'s error during remove projects'));
            }
        });
      })
      .then(function() {
        Users.remove({}, function(err) {
          if (err) {
            done(new Error('Database\'s error during remove users'));
          }
        });
      })
      .then(function() {
        done();
      });
    });

    describe('Create /tasks', function() {
      it('Should create task', function (done) {
        var user1, task;
        request(app)
          .post('/api/users')
          .send(testData.usersData[0])
          .then(function(res) {
            res.status.should.be.equal(200);
            res.body.token.should.be.a('string');
            user1 = res.body.user;
            user1.token = res.body.token;

            return request(app)
              .post('/api/projects')
              .set('Authorization', 'Bearer ' + user1.token)
              .send({
                'title': 'project1'
              });
          })
          .then(function(res) {
            res.status.should.be.equal(200);
            res.body.data.title.should.equal('project1');
            res.body.data.tasks.length.should.equal(0);
            res.body.data.user.should.equal(user1._id);
            project1 = res.body.data;
            return request(app)
              .post('/api/tasks')
              .set('Authorization', 'Bearer ' + user1.token)
              .send({
                'title': 'task1',
                'projectId': project1._id
              });
          })
          .then(function(res) {
            res.status.should.be.equal(200);
            res.body.data.title.should.equal('task1');
            task = res.body.data;
            return request(app)
              .get('/api/projects')
              .set('Authorization', 'Bearer ' + user1.token);
          })
          .then(function(res) {
            res.status.should.be.equal(200);
            res.body.data[0]._id.should.equal(project1._id);
            res.body.data[0].tasks.should.include(task._id);
            done();
          });
      });
    });

  });
};