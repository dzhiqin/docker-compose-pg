var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var quotesRouter = require('./routes/quotes');
const morgan = require('morgan')
const fs = require('fs')
// const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {flags: 'a'});
const FileStreamRotator = require('file-stream-rotator')
const logDirectory = path.join(__dirname, 'logs')
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)
const rotateLogStream = FileStreamRotator.getStream({
  date_format: 'YYYYMMDD',
  filename: path.join(logDirectory,'access-%DATE%.log'),
  frequency: 'daily',
  verbose: 'false',
  max_logs: 10,
  size: '50k'
})
var app = express();


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// 自定义token
morgan.token('body',function(req,res){
  return req.body ? JSON.stringify(req.body) : '-'
})
// 自定义format，其中包含自定义的token
morgan.format('custom', '[:date[clf]] :method :body :url HTTP/:http-version :status :res[content-length] - :response-time ms');

// 使用自定义的format
app.use(morgan('custom', {
  stream: rotateLogStream,
  // skip:  function(req,res) {return res.statusCode < 400}
}));


app.use('/', indexRouter);
app.use('/quotes', quotesRouter);

module.exports = app;
