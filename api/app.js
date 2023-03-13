var createError = require('http-errors');
var express = require('express');
var cors = require('cors')
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var history = require('connect-history-api-fallback')
var indexRouter = require('./routes/index')
var extensionsRouter = require('./routes/extension');

var app = express();

const corsOptions = {
  origin: true,
  credentials: true,
}
//cors setup
app.use(cors(corsOptions));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.set('port', 3000);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/', indexRouter)
app.use('/extension', extensionsRouter);
app.use(history())
app.use(express.static(path.join(__dirname, 'public')));
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
