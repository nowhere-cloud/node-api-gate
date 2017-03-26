
'use strict';

const Express = require('express');
const Proxy   = require('express-http-proxy');
const Router = Express.Router();
const URL = require('url');
const Client = require('../helper/amqp-sender');

const Checker   = require('../helper/xen-check');
const Messenger = new Client('hypervisor-net-in');

/**
 * All GET Requests are Proxied Directly to Ruby-Based Middleware
 */
Router.use('/', Proxy('http://xen-rest:4567/', {
  forwardPath: (req, res) => {
    return '/vif' + URL.parse(req.url).path;
  },
  filter: (req, res) => {
    return req.method === 'GET';
  },
  limit: '5mb',
  timeout: 30*1000
}));

Router.post('/create', (req, res, next) => {

});

Router.delete('/:uuid', (req, res, next) => {

});

Router.route('/:uuid/cable')
  .post((req, res, next) => {
    // Plug Cable

  })
  .delete((req, res, next) => {
    // Unplug Cable

  });

module.exports = Router;
