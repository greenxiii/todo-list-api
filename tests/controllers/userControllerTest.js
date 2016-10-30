var request = require('supertest-as-promised');
var app = require('../../server');
var assert = require('assert');
var chai = require('chai');
var mongoose = require('mongoose');
var should = chai.should();

var Users = require('../../app/models/users');

module.exports = function(testData) {
  describe('User Ctrl:', function() {
    beforeEach(function(done) {
      Users.remove({}, function(err) {
        done();
      });
    });

    describe('Create /users:', function() {
      it('Should create user with email ' + testData.usersData[0].email, function (done) {
        request(app)
          .post('/api/users')
          .send(testData.usersData[0])
          .end(function(err, res) {
            res.status.should.be.equal(200);
            res.body.token.should.be.a('string');
            done();
          });
      });

      it('Should not create user with not valid email', function (done) {
        request(app)
          .post('/api/users')
          .send({
            'email': 'noywalid.com',
            'password': testData.usersData[1].password,
            'firstName': testData.usersData[1].firstName,
            'lastName': testData.usersData[1].lastName,
          })
          .end(function(err,res) {
            res.status.should.be.equal(400);
            res.body.message.should.be.a('Object');
            res.body.message.email[0].should.be.equal('Should be valid email address');
            done();
          });
      });

      it('Should not create user without email', function (done) {
        request(app)
          .post('/api/users')
          .send({
            'password': testData.usersData[1].password,
            'firstName': testData.usersData[1].firstName,
            'lastName': testData.usersData[1].lastName,
          })
          .end(function(err,res) {
            res.status.should.be.equal(400);
            res.body.message.should.be.a('Object');
            res.body.message.email[0].should.be.equal('Can\'t be blank');
            res.body.message.email[1].should.be.equal('Should be valid email address');
            done();
          });
      });

      it('Should not create user without firstName', function (done) {
        request(app)
          .post('/api/users')
          .send({
            'email': testData.usersData[1].email,
            'password': testData.usersData[1].password,
            'lastName': testData.usersData[1].lastName
          })
          .end(function(err,res) {
            res.status.should.be.equal(400);
            res.body.message.should.be.a('Object');
            res.body.message.firstName[0].should.be.equal('Can\'t be blank');
            done();
          });
      });

      it('Should not create user without lastName', function (done) {
        request(app)
          .post('/api/users')
          .send({
            'email': testData.usersData[1].email,
            'password': testData.usersData[1].password,
            'firstName': testData.usersData[1].firstName
          })
          .end(function(err,res) {
            res.status.should.be.equal(400);
            res.body.message.should.be.a('Object');
            res.body.message.lastName[0].should.be.equal('Can\'t be blank');
            done();
          });
      });

      it('Should not create user without password', function (done) {
        request(app)
          .post('/api/users')
          .send({
            'email': testData.usersData[1].email,
            'firstName': testData.usersData[1].firstName,
            'lastName': testData.usersData[1].lastName
          })
          .end(function(err,res) {
            res.status.should.be.equal(400);
            res.body.message.should.be.a('Object');
            res.body.message.password[0].should.be.equal('Can\'t be blank');
            done();
          });
      });
    });
  });
};