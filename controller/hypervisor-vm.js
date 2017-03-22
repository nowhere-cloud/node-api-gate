
'use strict';

const Express = require('express');
const Proxy   = require('express-http-proxy');
const Router = Express.Router();

const URL = require('url');

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

Router.post('/power/on', (req, res, next) => {

});

Router.post('/power/off', (req, res, next) => {

});

Router.post('/power/suspend', (req, res, next) => {

});

Router.post('/power/resume', (req, res, next) => {

});

module.exports = Router;
