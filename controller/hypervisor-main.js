'use strict';

const Express = require('express');
const Router  = Express.Router();

/**
 * Mount Sub-Page
 */
const vm_page = require('./hypervisor-vm');
const api_health  = require('./hypervisor-health');
const net_page  = require('./hypervisor-net');
const vif_page  = require('./hypervisor-vif');
const block_main_page  = require('./hypervisor-block-main');

Router.get('/', (req, res, next) => {
  res.sendStatus(400);
});

Router.use('/vm', vm_page);
Router.use('/net', net_page);
Router.use('/vif', vif_page);
Router.use('/block', block_main_page);
Router.use('/stats', api_health);

module.exports = Router;
