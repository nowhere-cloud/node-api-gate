'use strict';

const Express = require('express');
const Router  = Express.Router();

/**
 * Mount Sub-Page
 */
const vm_page = require('./hypervisor-vm');
const health  = require('./hypervisor-health');

Router.get('/', (req, res, next) => {
  res.sendStatus(400);
});

Router.use('/vm', vm_page);
Router.use('/stats', health);

module.exports = Router;
