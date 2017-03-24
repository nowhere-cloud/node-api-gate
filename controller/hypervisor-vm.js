
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
    return '/vm' + URL.parse(req.url).path;
  },
  filter: (req, res) => {
    return req.method === 'GET';
  },
  limit: '5mb',
  timeout: 30*1000
}));

Router.post('/create', (req, res, next) => {

});

Router.post('/:uuid/power/on', (req, res, next) => {

});

Router.post('/:uuid/power/off', (req, res, next) => {

});

Router.post('/:uuid/power/suspend', (req, res, next) => {

});

Router.post('/:uuid/power/resume', (req, res, next) => {

});

Router.route('/:uuid/tags')
  .post((req, res, next) => {

  })
  .delete((req, res, next) => {

  });

module.exports = Router;
