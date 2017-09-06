var mongoose = require('mongoose');  

var tasksSchema = new mongoose.Schema({  
  email: {         
        type: String,
        ref: 'usersModel',
        required: true
  },
  date: {         
        type: Date,
        required: true 
  },
  details: {         
        type: String,
        required: true 
  },
  completed: {         
        type: Boolean,
        required: true
  }
});

var tasksModels = mongoose.model('Tasks', tasksSchema);

var usersSchema = new mongoose.Schema({  
  email: {         
        type: String,
        required: true,
        unique: true,
        index: true
  },
  password: {         
        type: String,
        required: true 
  },
  activated: {         
        type: Boolean,
        required: true 
  }
});
var usersModel = mongoose.model('Users', usersSchema);



