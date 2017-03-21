'use strict';

const Express = require('express');
const Proxy   = require('express-http-proxy');
const Router  = Express.Router();
const env     = process.env;
/*
 * Helpers, In-House Modules
 */
const hlp_health = require('../helper/healthcheck');

// Endpoint for checking API Health
// Port 4567 is WebRick (Ruby Internal HTTP Engine) Port
// xen-rest is hardcoded on Docker-Compose File.
Router.get('/stats/api', (req, res, next) => {
  hlp_health.http('xen-rest', 4567, '/').then(() => {
    res.sendStatus(200);
  }).catch((err) => {
    next(err);
  });
});

// Endpoint for checking XenServer Health
// Why I don't Hardcode the XenAPI Port to 443? Because it is making life easier of SSH Tunnel!
Router.get('/stats/xen', (req, res, next) => {
  hlp_health.https(env.XAPI_PATH, Number(env.XAPI_PORT), '/', true).then(() => {
    res.sendStatus(200);
  }).catch((err) => {
    next(err);
  });
});

module.exports = Router;
