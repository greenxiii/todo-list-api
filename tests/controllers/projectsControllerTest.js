var request = require('supertest-as-promised');
var app = require('../../server');
var assert = require('assert');
var chai = require('chai');
var mongoose = require('mongoose');
var should = chai.should();

var Projects = require('../../app/models/projects');
var Users = require('../../app/models/users');

module.exports = function(testData) {
  describe('Projects Ctrl:', function() {
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

    describe('Create /projects:', function() {
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
            done();
          });
      });

      // it('Should not create projects without title', function (done) {
      //   request(app)
      //     .post('/api/users')
      //     .send({
      //       'email': 'noywalid.com',
      //       'password': testData.usersData[1].password,
      //       'firstName': testData.usersData[1].firstName,
      //       'lastName': testData.usersData[1].lastName,
      //     })
      //     .end(function(err,res) {
      //       res.status.should.be.equal(400);
      //       res.body.message.should.be.a('Object');
      //       res.body.message.email[0].should.be.equal('Should be valid email address');
      //       done();
      //     });
      // });

      // it('Should not create user without email', function (done) {
      //   request(app)
      //     .post('/api/users')
      //     .send({
      //       'password': testData.usersData[1].password,
      //       'firstName': testData.usersData[1].firstName,
      //       'lastName': testData.usersData[1].lastName,
      //     })
      //     .end(function(err,res) {
      //       res.status.should.be.equal(400);
      //       res.body.message.should.be.a('Object');
      //       res.body.message.email[0].should.be.equal('Can\'t be blank');
      //       res.body.message.email[1].should.be.equal('Should be valid email address');
      //       done();
      //     });
      // });

      // it('Should not create user without firstName', function (done) {
      //   request(app)
      //     .post('/api/users')
      //     .send({
      //       'email': testData.usersData[1].email,
      //       'password': testData.usersData[1].password,
      //       'lastName': testData.usersData[1].lastName
      //     })
      //     .end(function(err,res) {
      //       res.status.should.be.equal(400);
      //       res.body.message.should.be.a('Object');
      //       res.body.message.firstName[0].should.be.equal('Can\'t be blank');
      //       done();
      //     });
      // });

      // it('Should not create user without lastName', function (done) {
      //   request(app)
      //     .post('/api/users')
      //     .send({
      //       'email': testData.usersData[1].email,
      //       'password': testData.usersData[1].password,
      //       'firstName': testData.usersData[1].firstName
      //     })
      //     .end(function(err,res) {
      //       res.status.should.be.equal(400);
      //       res.body.message.should.be.a('Object');
      //       res.body.message.lastName[0].should.be.equal('Can\'t be blank');
      //       done();
      //     });
      // });

      // it('Should not create user without password', function (done) {
      //   request(app)
      //     .post('/api/users')
      //     .send({
      //       'email': testData.usersData[1].email,
      //       'firstName': testData.usersData[1].firstName,
      //       'lastName': testData.usersData[1].lastName
      //     })
      //     .end(function(err,res) {
      //       res.status.should.be.equal(400);
      //       res.body.message.should.be.a('Object');
      //       res.body.message.password[0].should.be.equal('Can\'t be blank');
      //       done();
      //     });
      // });
    });
  });
};