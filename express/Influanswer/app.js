var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var user = require('./module/user');

var indexRouter = require('./routes/index');

var app = express();

app.use((req, res, next) => {
  res.r = (result) => {
      //result가 있을 때
      if (result) {
          res.json({
              status: 200,
              code: 200,
              message: "success",
              data: result
          });
      }

      //result가 없을 때
      else {
          res.json({
              status: 200,
              code: 200,
              message: "success"
          });
      }
  };
  next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use(async (req, res, next) => {
//   let result = await user.verify(req.headers.token)

//   if(!result){
//     next("10401")
//   }
// });

app.use('/', indexRouter);
// error handler
require('./errorHandeler')(app);

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
