var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var crypto = require('crypto');

var config = require('./config');
var routes = require('./routes/index');
var users = require('./routes/users');
var wechat = require('./routes/wechat');

var app = express();

// 视图引擎
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// 日志、请求参数解析、静态资源目录
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.query());

// 接口列表
app.use('/', routes);
app.use('/users', users);
app.use('/wechat',wechat);
app.use('/test', function(req, res, next) {
    var query = req.query;
    var signature = query.signature;
    var echostr = query.echostr;
    var timestamp = query.timestamp;
    var nonce = query.nonce;
    console.log(query);

    var oriArray = new Array();
    oriArray[0] = nonce;
    oriArray[1] = timestamp;
    oriArray[2] = config.token; //微信开发者中心页面里填的token
    oriArray.sort();
    var original = oriArray.join('');
    console.log("Original str : " + original);
    console.log("Signature : " + signature);

    var md5sum = crypto.createHash("sha1");
    md5sum.update(original);
    var scyptoString = md5sum.digest("hex");

    console.log("scyptoString：" + scyptoString);
    if (signature == scyptoString) {
        res.end(echostr);
    } else {
        res.end("false");
    }
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
