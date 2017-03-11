'use strict';

const express = require('express');
const router = express.Router();
const sqlize = require('sequelize');
const db_con = new sqlize('mysql://' + process.env.MYSQL_USER + ':' + process.env.MYSQL_PASS + '@mysql/' + process.env.MYSQL_DB);
const qs = require('querystring');
const Schema = require('../model/dns');
const Rabbit = require('../helper/amqp-sender');

/**
 * Prepare Table, and query model
 */
const DNS = db_con.define(Schema.tblname, Schema.tblschema, Schema.tblopts);
DNS.sync();

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

const hlp_rabbit = new Rabbit('dns-in');

/**
 * GET DB Stat as Status Check
 * Sequelize does not support Stats, but Sequelize.authenticate is useful
 * for testing the MySQL is alive or dead
 */
router.get('/', (req, res, next) => {
  DNS.findAll().then((err, rsvp) => {
    if (err) return next(err);
    res.json(rsvp);
  });
});


router.get('/stats', (req, res, next) => {
  db_con.authenticate().then((err, rsvp) => {
    if (err) return next(err);
    res.sendStatus(200);
  });
});

module.exports = router;