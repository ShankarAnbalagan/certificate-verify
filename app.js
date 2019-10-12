var createError = require('http-errors');
var express = require('express');
var path = require('path');
var dotenv = require('dotenv');
var mongoose = require('mongoose');
var cors=require('cors');

dotenv.config();


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dataRouter = require('./routes/data');

var app = express();

mongoose.connect(process.env.MONGO_URI,{useNewUrlParser:true, useUnifiedTopology: true},function(err,data){
  if(err)
    console.log("Error in database connection");
  else
    console.log("Database connection successsfull");
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/data',dataRouter);

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
