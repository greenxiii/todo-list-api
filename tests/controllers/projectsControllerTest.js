var request = require('supertest-as-promised');
var app = require('../../server');
var assert = require('assert');
var chai = require('chai');
var mongoose = require('mongoose');
var should = chai.should();

var Projects = require('../../app/models/projects');
var Users = require('../../app/models/users');

module.exports = function(testData) {
  describe('Projects Ctrl', function() {
    beforeEach(function(done) {
      Projects.remove({}, function(err) {
        if (err) {
            done(new Error('Database\'s error during remove projects'));
          }
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

    describe('Create /projects', function() {
      it('Should create project with title', function (done) {
        var user1;
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
            done();
          });
      });

      it('Should not create project without title', function (done) {
        var user1;
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
          })
          .then(function(res) {
            res.status.should.be.equal(400);
            res.body.message.title[0].should.equal('Can\'t be blank');
            done();
          });
      });
    });

    describe('Edit /projects', function() {
      it('Should edit project title', function (done) {
        var user1, project;
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
            project = res.body.data;
            return request(app)
              .put('/api/projects/' + project._id )
              .set('Authorization', 'Bearer ' + user1.token)
              .send({
                'title': 'newTitle'
              });
          })
          .then(function(res) {
            res.status.should.be.equal(200);
            res.body.data._id.should.equal(project._id);
            res.body.data.title.should.equal('newTitle');
            res.body.data.tasks.length.should.equal(0);
            res.body.data.user.should.equal(user1._id);
            res.body.message.should.equal('Project successfully updated');
            done();
          });
      });

      it('Should not edit project title with wrong id', function (done) {
        var user1, project;
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
            project = res.body.data;
            return request(app)
              .put('/api/projects/111111111111111111111111')
              .set('Authorization', 'Bearer ' + user1.token)
              .send({
                'title': 'newTitle'
              });
          })
          .then(function(res) {
            res.status.should.be.equal(404);
            res.body.message.should.equal('Project not found');
            done();
          });
      });

    });

    describe('Fetch /projects', function() {
      it('Should fetch users projects', function (done) {
        var user1, project1, project2;
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
              .post('/api/projects')
              .set('Authorization', 'Bearer ' + user1.token)
              .send({
                'title': 'project2'
              });
          })
          .then(function(res) {
            res.status.should.be.equal(200);
            res.body.data.title.should.equal('project2');
            res.body.data.tasks.length.should.equal(0);
            res.body.data.user.should.equal(user1._id);
            project2 = res.body.data;
            return request(app)
              .get('/api/projects')
              .set('Authorization', 'Bearer ' + user1.token)
          })
          .then(function(res) {
            res.status.should.be.equal(200);
            res.body.data.should.be.a('Array');
            res.body.data[0]._id.should.equal(project1._id);
            res.body.data[0].title.should.equal('project1');
            res.body.data[0].user.should.equal(user1._id);
            res.body.data[1]._id.should.equal(project2._id);
            res.body.data[1].title.should.equal('project2');
            res.body.data[1].user.should.equal(user1._id);
            done();
          });
      });

      it('Should fetch empty array of users projects', function (done) {
        var user1;
        request(app)
          .post('/api/users')
          .send(testData.usersData[0])
          .then(function(res) {
            res.status.should.be.equal(200);
            res.body.token.should.be.a('string');
            user1 = res.body.user;
            user1.token = res.body.token;
            return request(app)
              .get('/api/projects')
              .set('Authorization', 'Bearer ' + user1.token)
          })
          .then(function(res) {
            res.status.should.be.equal(200);
            res.body.data.should.be.a('Array');
            res.body.data.length.should.equal(0);
            done();
          });
      });

    });
  });
};