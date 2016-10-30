var request = require('supertest-as-promised');
var app = require('../../server');
var assert = require('assert');
var chai = require('chai');
var mongoose = require('mongoose');
var should = chai.should();

var Users = require('../../app/models/users');

module.exports = function(testData) {
  describe('Auth Ctrl:', function() {
    beforeEach(function(done) {
      Users.remove({}, function(err) {
          done();
      });
    });

    describe('Login /auth/login:', function() {
      it('Should login user with email ' + testData.usersData[0].email, function (done) {
        request(app)
          .post('/api/users')
          .send(testData.usersData[0])
          .then(function(res) {
            console.log(res.status);
            res.status.should.be.equal(200,'Failed during creation of user');
            res.body.should.include.keys('user');
            res.body.user.should.include.keys('_id');
            res.body.should.include.keys('token');
            return request(app)
              .post('/api/auth/login')
              .send({
                email: testData.usersData[0].email,
                password: testData.usersData[0].password
              });
          })
          .then(function(res) {
            res.status.should.be.equal(200,'Failed during user login');
            res.body.should.include.keys('user');
            res.body.user.should.contain.all.keys({
              firstName: testData.usersData[0].firstName,
              lastName: testData.usersData[0].lastName,
              email: testData.usersData[0].email
            });
            res.body.user.should.include.keys('_id');
            res.body.should.include.keys('token');
            done();
          });
      });

      it('Should throws error 401 (email is wrong)', function (done) {
        request(app)
          .post('/api/users')
          .send(testData.usersData[0])
          .then(function (res) {
            res.status.should.be.equal(200,'Failed during creation of user');
            res.body.should.include.keys('user');
            res.body.user.should.include.keys('_id');
            res.body.should.include.keys('token');

            return request(app)
              .post('/api/auth/login')
              .send({
                email: testData.usersData[0].email+'a',
                password: testData.usersData[0].password
              });
          })
          .then(function (res) {
            res.status.should.be.equal(401,'Failed during user login');
            done();
          });
      });

      it('Should throws error 401 (password is wrong)', function (done) {
        request(app)
          .post('/api/users')
          .send(testData.usersData[0])
          .then(function (res) {
            res.status.should.be.equal(200,'Failed during creation of user');
            res.body.should.include.keys('user');
            res.body.user.should.include.keys('_id');
            res.body.should.include.keys('token');

            return request(app)
              .post('/api/auth/login')
              .send({
                email: testData.usersData[0].email,
                password: testData.usersData[0].password+'123'
              });
          })
          .then(function (res) {
            res.status.should.be.equal(401,'Failed during user login');
            done();
          });
      });

      it('Should throws error 400 (email isn\'t specified)', function (done) {
        request(app)
          .post('/api/users')
          .send(testData.usersData[0])
          .then(function (res) {
            res.status.should.be.equal(200,'Failed during creation of user');
            res.body.should.include.keys('user');
            res.body.user.should.include.keys('_id');
            res.body.should.include.keys('token');

            return request(app)
              .post('/api/auth/login')
              .send({
                password: testData.usersData[0].password
              });
          })
          .then(function (res) {
            console.log(res.body);
            res.status.should.be.equal(400,'Missing credentials');
            res.body.should.be.a('Object');
            res.body.should.include.keys('message');
            res.body.message.should.include.keys('email');
            res.body.message.email.should.be.a('Array');
            done();
          });
      });

      it('Should throws error 400 (password isn\'t specified)', function (done) {
        request(app)
          .post('/api/users')
          .send(testData.usersData[0])
          .then(function (res) {
            res.status.should.be.equal(200,'Failed during creation of user');
            res.body.should.include.keys('user');
            res.body.user.should.include.keys('_id');
            res.body.should.include.keys('token');

            return request(app)
              .post('/api/auth/login')
              .send({
                email: testData.usersData[0].email
              });
          })
          .then(function (res) {
            res.status.should.be.equal(400,'Failed during user login');
            res.body.should.be.a('Object');
            res.body.should.include.keys('message');
            res.body.message.should.include.keys('password');
            res.body.message.password.should.be.a('Array');
            done();
          });
      });
    });
  });
};