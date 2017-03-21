'use strict';

const Express = require('express');
const Proxy   = require('express-http-proxy');
const Router  = Express.Router();
const env     = process.env;
/*
 * Helpers, In-House Modules
 */
const hlp_health = require('../helper/healthcheck');

Router.get('/stats/api', (req, res, next) => {
  hlp_health.http('xen-mid-rest', 4567, '/').then(() => {
    res.sendStatus(200);
  }).catch((err) => {
    next(err);
  });
});

Router.get('/stats/xen', (req, res, next) => {
  hlp_health.https(env.XAPI_PATH, Number(env.XAPI_PORT), '/', true).then(() => {
    res.sendStatus(200);
  }).catch((err) => {
    next(err);
  });
});

module.exports = Router;
