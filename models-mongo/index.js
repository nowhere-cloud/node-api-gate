'use strict';
const mongoose = require('mongoose');
const syslog = require('./syslog.js');

/**
 * Connect to MongoDb
 */
mongoose.connect(process.env.MONGODB_URI);

/**
 * Expose the Model
 */
module.exports.Syslog = syslog;
