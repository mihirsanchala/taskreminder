var Config = require('./config')
conf = new Config();

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var dbModels = require('./models/db');
var usersModels = require('./models/users');
var indexRoutes = require('./routes/index');
var dashboardRoutes = require('./routes/dashboard');
var mailer = require('express-mailer');

var mailerCron = require('./mailerCron');

app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/fonts/', express.static(path.join(__dirname, 'public/fonts')));

app.set('trust proxy', 1);
app.use(expressSession({
		name: conf.session.name,
		secret: conf.session.secret,
		httpOnly: true,
		resave: false,
		saveUninitialized: false
}));

mailer.extend(app, {
    from: conf.mailer.from,
    host: conf.mailer.host, 
    secureConnection: false,
    port: conf.mailer.port,
    transportMethod: conf.mailer.transportMethod
});

app.use('/', indexRoutes);
app.use('/dashboard', dashboardRoutes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};
	console.log(err.message);

	if(err.status == 404)
		errorPage = 'pages/404';
	else
		errorPage = 'pages/error';
		
	res.status(err.status || 500);
	res.render(errorPage, {title: 'Error'});	
});

module.exports = app;
