var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors')
const bodyParser = require("body-parser");
const { expressjwt } = require('express-jwt');
var secret = require("./config/config.json");

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.resolve('/public/uploads')));
app.use(express.static('public'));
//Routes
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var socketRouter = require('./routes/socket');

app.use('/', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/sockets', socketRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

//JWT handle
app.use(
  expressjwt(
    { secret: secret.accessToken, algorithms: ['HS256'] })
    .unless( // This allows access to /token/sign without token authentication
      {
        path: [
          '/users/login',
          '/users/signup',
          '/socket'
        ]
      }
    )
);


module.exports = app;
