
'use strict';

const Express = require('express');
const Proxy   = require('express-http-proxy');
const Router = Express.Router();

/**
 * SubApp for handling some group of functions
 */
const vdi_page  = require('./hypervisor-block-vdi');
const vbd_page  = require('./hypervisor-block-vbd');

Router.use('/vdi', vdi_page);
Router.use('/vbd', vbd_page);

module.exports = Router;
