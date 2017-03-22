
'use strict';

const Express = require('express');
const Proxy   = require('express-http-proxy');
const Router = Express.Router();


Router.use('/', Proxy('http://xen-rest/', {
  forwardPath: '/vm/',
  limit: '5mb',
  timeout: (30*1000),
  filter: (req, res) => {
    return req.method === 'GET';
  }
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
