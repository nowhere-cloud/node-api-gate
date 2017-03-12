'use strict';

const express = require('express');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

/**
 * Controllers
 */
const index = require('./controller/index');
const syslog = require('./controller/syslog');
const dns = require('./controller/dns');

/**
 * App Core
 */
const app = express();

app.use(logger('common'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());

// Namespacing
app.use('/', index);
app.use('/syslog', syslog);
app.use('/dns', dns);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  // render the error JSON Object
  res.status(err.status || 500).json(err);
});

module.exports = app;
