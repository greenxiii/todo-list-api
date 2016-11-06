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
    type: Date,
    default: +new Date() + 24*60*60*1000
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  }
});

module.exports = mongoose.model('Tasks', tasksSchema);