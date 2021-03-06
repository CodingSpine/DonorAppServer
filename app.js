var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const loginRouter = require('./routes/login');

const mongoose = require('mongoose');
// const MongoClient = require('mongodb').MongoClient;

var uri = "mongodb://app:nEshKXCPxp9vqj7o@\
donorapp-dev-shard-00-00-e7utu.mongodb.net:27017,\
donorapp-dev-shard-00-01-e7utu.mongodb.net:27017,\
donorapp-dev-shard-00-02-e7utu.mongodb.net:27017/test?ssl=true&replicaSet=DonorApp-Dev-shard-0&authSource=admin";
const connect = mongoose.connect(uri, {
    userMongoClient: true
});
connect.then((db) => {
    
}, (err) => {
    console.log(err);
});
// MongoClient.connect(uri, function(err, client) {
//    const collection = client.db("DonorApp-Demo").collection("Login");
//    // perform actions on the collection object
//    collection.insertOne(
//        {"name":"Ray"},
//         (error, result) => {
//             console.log(error);
//             console.log(result);
//         });
//    client.close();
// });

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/login', loginRouter);

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
