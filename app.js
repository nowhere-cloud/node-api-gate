'use strict';

const Express = require('express');
const Logger = require('morgan');
const bodyParser = require('body-parser');
const Models = require('./models/');

/**
 * App Core
 */
const app = Express();

app.use(Logger('common'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

/**
 * Controllers
 */
app.use('/', require('./controller/index'));
app.use('/log', require('./controller/syslog'));
app.use('/task', require('./controller/task'));
app.use('/dns', require('./controller/dns-main'));
app.use('/xen', require('./controller/hypervisor-main'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next({
    status: 404,
    error: 'ENOTFOUND'
  });
});

// error handler
app.use(function(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  // render the error in JSON
  res.status(err.status || 500).send(err);
});

module.exports = app;
