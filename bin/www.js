#!/usr/bin/env node

'use strict';

/**
 * Module dependencies.
 */

const app = require('../app');
const debug = require('debug')('node-apimanager:server');
const http = require('http');
const models = require('../models');

/**
 * Get port from environment and store in Express.
 * It will also Normalize a port into a number, string, or false.
 */

const port = () => {
  let raw_port = (process.env.PORT || '3000');
  let port = parseInt(raw_port, 10);
  if (isNaN(port)) {
    // named pipe
    return raw_port;
  }
  if (port >= 0) {
    // port number
    return port;
  }
  return false;
};

app.set('port', port);

/**
 * Listen on provided port, on all network interfaces.
 * sync() will create all table if they doesn't exist in database
 */
const timer = setInterval(() => {
  models.sequelize.authenticate().then(() => {
    console.info('Database Ready, Executing Migration');
    models.sequelize.sync();
    clearInterval(timer);
  }).catch(() => {
    console.error('Waiting for Database...');
  });
}, 1000);


/**
 * Create Server
 */
const server = http.createServer(app);

/**
 * Attach Server to the Port // Pipe
 */
server.listen(port);

/**
 * Event listener for HTTP server 'error' event.
 */

server.on('error', (error) => {
  if (error.syscall !== 'listen') {
    throw error;
  }

  let bind = typeof port === 'string' ?
    'Pipe ' + port :
    'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
  case 'EACCES':
    throw new Error(bind + ' requires elevated privileges');
  case 'EADDRINUSE':
    throw new Error(bind + ' is already in use');
  default:
    throw error;
  }
});

/**
 * Event listener for HTTP server 'listening' event.
 */

server.on('listening', () => {
  let addr = server.address();
  let bind = typeof addr === 'string' ?
    'pipe ' + addr :
    'port ' + addr.port;
  debug('Listening on ' + bind);
});
