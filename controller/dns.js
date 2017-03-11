'use strict';

const express = require('express');
const router = express.Router();
const MySQL = require('sequelize');
const db_raw = new MySQL('mysql://' + process.env.MYSQL_USER + ':' + process.env.MYSQL_PASSWORD + '@mysql/' + process.env.MYSQL_DATABASE);
const streamer = require('sequelize-stream');
const db_s = streamer(db_raw);
const qs = require('querystring');

/**
 * Mongoose Stuffs
 */


/**
 * Route Preprocess: Add JSON Header to reduce code dupe
 */
const pp_json_header = (req, res, next) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  next();
};

/**
 * Sanitze Input String
 * @param  String raw_string Raw String, such as from user input
 * @return String            Sanitzed String
 */
const hlp_sanitze = (raw_string) => {
  return qs.escape(raw_string);
};

/**
 * GET DB Stat as Status Check
 */
router.get('/stats', (req, res, next) => {
  Syslog.collection.stats((err, doc) => {
    if (err) return next(err);
    // Remove useless Key from doc
    delete doc.wiredTiger;
    delete doc.indexDetails;
    // Render the result
    res.json();
  });
});

module.exports = router;
