var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var jwt = require('express-jwt');
var session = require('express-session');
var config = require('config');

var UsersController = require('./app/controllers/UsersController');
var AuthController = require('./app/controllers/AuthController');

var app = express();
var auth = jwt({
  secret: config.Secret,
  userProperty: 'user'
});

mongoose.Promise = global.Promise;
mongoose.connect(config.DBHost);

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
// app.use(function(req, res, next){
// 	console.log(req.body);
// 	next();
// });

app.use(session({
  secret: config.Secret
}));

var port = process.env.PORT || config.ServerPort;

// ROUTES
// =============================================================================
var router = express.Router();
/* auth */
router.post('/auth/login', AuthController.login);
router.post('/auth/login/facebook', AuthController.facebookLogin);
router.post('/auth/login/google', AuthController.googleLogin);

/* users */
router.post('/users', UsersController.create);

app.use('/api', router);

// START SERVER
// =============================================================================
var server =  app.listen(port);
console.log('Magic happens on port ' + port);
module.exports = server;