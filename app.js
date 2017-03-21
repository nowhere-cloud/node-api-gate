'use strict';

const Express = require('express');
const Logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

/**
 * Controllers
 */
const index = require('./controller/index');
const log = require('./controller/syslog');
const dns = require('./controller/dns-main');
const xen = require('./controller/hypervisor-main');

/**
 * App Core
 */
const app = Express();

app.use(Logger('common'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());

// Namespacing
app.use('/', index);
app.use('/log', log);
app.use('/dns', dns);
app.use('/xen', xen);

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
