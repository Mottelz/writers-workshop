//packages
var express = require('express'); //used for the app engine
var path = require('path'); //used for filepaths
var logger = require('morgan'); //used to log
var cookieParser = require('cookie-parser'); //used to parse cookies
var bodyParser = require('body-parser'); //used to parse url

//routes
var index = require('./routes/index'); //index
var app = express();

//set view engine
app.set('views', path.join(__dirname, 'views/pages')); //where to store templates
app.set('view engine', 'ejs'); //using ejs as the template engine

//load packages & configure app
app.use(logger('dev')); //logs the requests and related technical data
app.use(bodyParser.json()); //parses the body of an HTTP request. Need to check out https://nodejs.org/en/docs/guides/anatomy-of-an-http-transaction/
app.use(bodyParser.urlencoded({ extended: false })); //disallow nested objects
app.use(cookieParser()); //parse cookies
app.use(express.static(path.join(__dirname, 'public'))); //set the static for css and related things.

//set directions
app.use('/', index);


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
    // render the error page
    res.status(err.status || 500);
    res.render('error');
});


module.exports = app;