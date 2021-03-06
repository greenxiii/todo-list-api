var mongoose = require('mongoose');
var projectsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  status: {
    type: Boolean,
    default: false
  },
  tasks: [{
	 type: mongoose.Schema.Types.ObjectId,
	 ref: 'Tasks'
  }],
  user: {
   type: mongoose.Schema.Types.ObjectId,
   ref: 'Users',
   required: true
  }
});

module.exports = mongoose.model('Projects', projectsSchema);