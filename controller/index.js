'use strict';

const Express = require('express');
const Router  = Express.Router();
const Moment  = require('moment');

/* GET home page. */
Router.get('/', (req, res, next) => {
  res.json({
    'start_time': Moment().subtract(process.uptime().toFixed(0), 'seconds').toISOString(),
    'uptime': process.uptime()
  });
});

Router.get('/stats', (req, res, next) => {
  res.sendStatus(200);
});

module.exports = Router;
