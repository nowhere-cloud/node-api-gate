
'use strict';

const Express = require('express');
const Proxy   = require('express-http-proxy');
const Router = Express.Router();
const URL = require('url');
const Client = require('../helper/amqp-sender');

const Checker   = require('../helper/xen-check');
const Messenger = new Client('hypervisor-blk-in');

/**
 * All GET Requests are Proxied Directly to Ruby-Based Middleware
 */
Router.use('/', Proxy('http://xen-rest:4567/', {
  forwardPath: (req, res) => {
    return '/block/vbd' + URL.parse(req.url).path;
  },
  filter: (req, res) => {
    return req.method === 'GET';
  },
  limit: '5mb',
  timeout: 30*1000
}));

// Router.post('/attach', (req, res, next) => {
//
// });

module.exports = Router;
