
'use strict';

const Express = require('express');
const Proxy   = require('express-http-proxy');
const Router = Express.Router();

const URL = require('url');

Router.use('/vdi', Proxy('http://xen-rest:4567/', {
  forwardPath: (req, res) => {
    return '/block/vdi' + URL.parse(req.url).path;
  },
  filter: (req, res) => {
    return req.method === 'GET';
  },
  limit: '5mb',
  timeout: 30*1000
}));

Router.post('/vdi/create', (req, res, next) => {

});

Router.use('/vbd', Proxy('http://xen-rest:4567/', {
  forwardPath: (req, res) => {
    return '/block/vbd' + URL.parse(req.url).path;
  },
  filter: (req, res) => {
    return req.method === 'GET';
  },
  limit: '5mb',
  timeout: 30*1000
}));

Router.post('/vbd/attach', (req, res, next) => {

});

module.exports = Router;
