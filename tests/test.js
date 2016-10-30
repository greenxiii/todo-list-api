process.env.NODE_ENV = 'test';

var testData = require('./_data');
require('./controllers/authControllerTest')(testData);
require('./controllers/userControllerTest')(testData);