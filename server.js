var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var jwt = require('express-jwt');
var session = require('express-session');
var config = require('config');
var cors = require('cors');

var validate = require('./app/validator');
require('./app/passport');

var UsersController = require('./app/controllers/UsersController');
var AuthController = require('./app/controllers/AuthController');
var ProjectsController = require('./app/controllers/ProjectsController');
var TasksController = require('./app/controllers/TasksController');

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
app.use(cors());
app.use(bodyParser.json());

// app.use(function(req, res, next) {
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
router.post('/auth/login', validate('auth:login'), AuthController.login);
router.post('/auth/login/facebook', AuthController.facebookLogin);

/* users */
router.post('/users', validate('users:create'), UsersController.create);

/* projects */
router.post('/projects', auth, validate('projects:create'), ProjectsController.create);
router.get('/projects', auth, ProjectsController.fetch);
router.put('/projects/:projectId', auth, validate('projects:edit'), ProjectsController.edit);
router.delete('/projects/:projectId', auth, ProjectsController.delete);

/* tasks */
router.post('/tasks', auth, validate('tasks:create'), TasksController.create);
router.put('/tasks/:taskId', auth, validate('tasks:edit'), TasksController.edit);
router.delete('/tasks/:taskId', auth, TasksController.delete);


app.use('/api', router);

// START SERVER
// =============================================================================
var server =  app.listen(port);
console.log('Magic happens on port ' + port);
module.exports = server;