'use strict';
const mongoose = require('mongoose');
const env      = process.env.NODE_ENV || 'development';
const config   = require('../config/config')['mongo'][env];

/**
 * Schemas
 * @type {Schema}
 */
const syslog   = require('./syslog.js');
const task   = require('./task.js');

/**
 * Use Bluebird Promise Library
 */
mongoose.Promise = require('bluebird');

/**
 * Connect to MongoDb
 */
mongoose.connect(config);

/**
 * Expose the Model
 */
module.exports = {
  mongoose: mongoose,
  Syslog: syslog,
  Task: task
};
