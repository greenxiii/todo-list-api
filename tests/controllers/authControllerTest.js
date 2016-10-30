var request = require('supertest');
var app = require('../../server');
var assert = require('assert');
var chai = require('chai');
var mongoose = require('mongoose');
var should = chai.should();

var Users = require('../../app/models/users');

module.exports = function(tData) {
  describe('Auth Ctrl:', function() {
    beforeEach(function(done) {
      Users.remove({}, function(err) {
          done();
      });
    });

    describe('Login /auth/login:', function() {
      it('Should login user with email ' + tData.usersData[0].email, function (done) {
        done();
      });
    });
  });
};