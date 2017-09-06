var CronJob = require('cron').CronJob;
var mongoose = require('mongoose');


var mailerJob = new CronJob({
  cronTime: '00 00 09 * * *',
  onTick: function() {
    var today = new Date();
    today.setHours(0,0,0,0);
    mongoose.model('Tasks').find({date: today, completed: false}, 
        function (err, tasks) {
        if (err) {
            console.log(err);
        } else {
            var taskDetails = [];
            tasks.forEach(function(singleTask) {
                if(typeof(taskDetails[singleTask.email]) == 'undefined')
                    taskDetails[singleTask.email] = [];
                taskDetails[singleTask.email].push({'_id': singleTask._id, 'details': singleTask.details});
            });
            console.log(taskDetails);
            for (var singleUser in taskDetails){
                app.mailer.send('./email_templates/taskDetails', {
                    to: singleUser,
                    subject: 'Tasks Details',
                    taskDetails: taskDetails[singleUser]
                }, function (err) {
                    if (err) {
                        console.log(err);
                        console.log('There was an error sending the email');
                    }
                });
            }
        }     
    }).sort({ email: -1 });
  },
  start: true,
  timeZone: 'Asia/Calcutta'
});