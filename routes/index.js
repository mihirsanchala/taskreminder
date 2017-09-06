var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var crypto = require('crypto');
var url = require('url');

router.get('/', function(req, res, next) {
  var sessionData = req.session;

  if(sessionData.email)
    res.redirect('/dashboard');
  else
    res.render("pages/index", {title: 'Home'});
});

router.get("/contact", (req, res) => {
	res.render("pages/contact", {title: 'Contact'});
});

router.get("/activate/:id", (req, res) => {
   mongoose.model('Users').findOneAndUpdate({ _id : req.params.id}, { activated : true}, function(err, users){
    if (err) {
      console.log(err);
      res.render('pages/error', {title: 'Error'});
    }
    else{
      if(users){
        req.session._id = users._id;
        req.session.email = users.email;
        res.redirect('/dashboard');
      }
      else
        res.render('pages/404', {title: 'Error'});
    }
  });
});

router.get("/completed/:id", (req, res) => {
   mongoose.model('Tasks').findOneAndUpdate({ _id : req.params.id}, { completed : true}, function(err, tasks){
    if (err) {
      console.log(err);
      res.render('pages/error', {title: 'Error'});
    }
    else{
      console.log(tasks);
      if(tasks){
        if(req.xhr)
          res.json({ status: 1 });
        else{
          if(req.session.email)
            res.redirect('/dashboard?pg=dashboard&code=1&info=1');
          else
            res.redirect('/?pg=index&code=1&info=1');
        }
      }
      else
        res.render('pages/404', {title: 'Error'});
    }
  });
});

router.get("/snooze/:id", (req, res) => {
    var tomDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
    tomDate.setHours(0,0,0,0);

    mongoose.model('Tasks').findOneAndUpdate({ _id : req.params.id, completed : false}, { date : tomDate}, function(err, tasks){
      if (err) {
        console.log(err);
        res.render('pages/error', {title: 'Error'});
      }
      else{
        if(tasks){
          if(req.xhr)
            res.json({ status: 1 });
          else{
            if(req.session.email)
              res.redirect('/dashboard?pg=dashboard&code=2&info=1');
            else
              res.redirect('/?pg=index&code=2&info=1');
          }
        }
        else
          res.render('pages/404', {title: 'Error'});
      }
    });
});

router.get("/logout", (req, res) => {
  req.session.destroy(function(err) {
    if(err)
      console.log(err);
    else 
      res.redirect('/');
  });
});

router.post('/verify', function(req, res){
	var type = req.body.type;
	var email = req.body.email;
	var encPswd = crypto.createHash('md5').update(req.body.pswd).digest("hex");;
  console.log(email);
	if(type == 'login'){
    mongoose.model('Users').findOne({'email': email}, '_id password activated', 
      function (err, users) {
        if (err) {
          console.log(err);
          res.json({ status: 0 });
        } else {
            if(users){
              if(users.password == encPswd){
                if(users.activated){
                  req.session._id = users._id;
                  req.session.email = email;
                  res.json({ status: 1 });
                }
                else
                  res.json({ status: 3 });
              }
              else
                res.json({ status: 2 });
            }
            else
              res.json({ status: 2 });
        }     
    })
	}
	else{
		mongoose.model('Users').create({
            email : email,
            password : encPswd,
            activated : false
        }, function (err, users) {
            if (err) {
              if(err.code == 11000){
                console.log("Duplicate Email Address Error");
                res.json({ status: 2 });
              }
              else{
                console.log("There was a problem adding the information to the database.");
                res.json({ status: 0 });
              }
            } else {
              res.mailer.send('./email_templates/activation', {
                to: email,
                bcc: 'mihirsanchala@gmail.com',
                subject: 'Activation Link',
                objectID: users._id
              }, function (err) {
                if (err) {
                  console.log(err);
                  console.log('There was an error sending the email');
                }
              });
              
              res.json({ status: 3 });
            }
        })
	}
});

module.exports = router;
