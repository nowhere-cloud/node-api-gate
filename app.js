'use strict';

const Express = require('express');
const Logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
const Models = require('./models/');

/**
 * Controllers
 */

const index = require('./controller/index');
const log = require('./controller/syslog');
const task = require('./controller/task');
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

// Load Authenticator
app.use(session({ secret: process.env.SESS_KEY }));
app.use(passport.initialize());
app.use(passport.session());
passport.use(Models.user.createStrategy());

// Namespacing
app.use('/', index);
app.use('/log', log);
app.use('/task', task);
app.use('/dns', dns);
app.use('/xen', xen);

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
