'use strict';
const mongoose = require('mongoose');
const syslog   = require('./syslog.js');
const env      = process.env.NODE_ENV || 'development';
const config   = require('../config/config')['mongo'][env];

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
module.exports.mongoose = mongoose;
module.exports.Syslog = syslog;
