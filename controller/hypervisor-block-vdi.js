
'use strict';

const Express = require('express');
const Proxy   = require('express-http-proxy');
const Router = Express.Router();

const URL = require('url');

/**
 * All GET Requests are Proxied Directly to Ruby-Based Middleware
 */
Router.use('/', Proxy('http://xen-rest:4567/', {
  forwardPath: (req, res) => {
    return '/block/vdi' + URL.parse(req.url).path;
  },
  filter: (req, res) => {
    return req.method === 'GET';
  },
  limit: '5mb',
  timeout: 30*1000
}));

Router.post('/create', (req, res, next) => {

});

module.exports = Router;
