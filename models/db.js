var mongoose = require('mongoose');

mongoose.connect( conf.db.url, {
  user: conf.db.user,
  pass: conf.db.pass
});