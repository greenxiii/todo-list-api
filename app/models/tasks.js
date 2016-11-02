var mongoose = require('mongoose');
var tasksSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  status: {
    type: Boolean,
    default: false
  },
  deadline: {
    type: Date
  }
});

module.exports = mongoose.model('Tasks', tasksSchema);