'use strict';

const Express = require('express');
const Router  = Express.Router();

/**
 * Mount Sub-Page
 */
const vm_page = require('./hypervisor-vm');
const api_health  = require('./hypervisor-health');
const net_page  = require('./hypervisor-net');
const block_page  = require('./hypervisor-block');

Router.get('/', (req, res, next) => {
  res.sendStatus(400);
});

Router.use('/vm', vm_page);
Router.use('/net', net_page);
Router.use('/block', block_page);
Router.use('/stats', api_health);

module.exports = Router;
