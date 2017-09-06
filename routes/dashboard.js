var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var authMiddleware = require('../middlewares/auth');

router.get('/', authMiddleware.isAuthenticated, function(req, res, next) {
  var sessionData = req.session;
  var userEmail = sessionData.email;

  // mongoose.model('Tasks').find({email: userEmail, date: { $gte: new Date() }}, 
  mongoose.model('Tasks').find({email: userEmail}, 
    function (err, tasks) {
      if (err) {
        console.log(err);
        res.render("pages/error", {title: 'Error'});
      } else {
        res.render("pages/dashboard", {title: 'Dashboard', allTasks: tasks});
      }     
  }).sort({ date: 1 });
 
}); 


router.post('/task/action', authMiddleware.isAuthenticated, function(req, res, next) {
  var sessionData = req.session;
  var userEmail = sessionData.email;
  var userID = sessionData._id;

  var type = req.body.type;

  if(type == 'delete'){
    var taskID = req.body.objectID;

    mongoose.model('Tasks').remove(
      { _id: taskID, email: userEmail },
      function(err, tasks) {
        if (err) {
            console.log(err);
            res.json({ status: 0 });
        } else 
            res.json({ status: 1 });
      });
	}
	else{
    var date = req.body.date;
    var details = req.body.details;

    if(type == 'edit')
        var taskID = req.body.objectID;
    else
        var taskID = mongoose.Types.ObjectId();

    var newTask = { _id: taskID, email: userEmail, date: date, details: details, completed: false};   
    var query = {_id:  taskID},
        update = newTask,
        options = { upsert: true };

    mongoose.model('Tasks').findOneAndUpdate(query, update, options, function(err, result) {
          if (err) {
            console.log("There was a problem adding the information to the database.");
            console.log(err);
            res.json({ status: 0 });
          } else {
            res.json({ status: 1, objectID: taskID });
          }
    });
	}
});

module.exports = router;
