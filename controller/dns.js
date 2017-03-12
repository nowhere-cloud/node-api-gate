'use strict';

const express = require('express');
const router = express();
const sqlize = require('sequelize');
const db_con = new sqlize('mysql://' + process.env.MYSQL_USER + ':' + process.env.MYSQL_PASS + '@mysql/' + process.env.MYSQL_DB);
const qs = require('querystring');
const Schema = require('../model/dns');
const Rabbit = require('../helper/amqp-sender');
const IP = require('ip');

/**
 * Prepare Table, and query model
 */
const DNS = db_con.define(Schema.tblname, Schema.tblschema, Schema.tblopts);
const tmr = setInterval(() => {
  db_con.authenticate().then((rsvp) => {
    DNS.sync();
    clearInterval(tmr);
  }).catch(() => {
    console.error('Waiting for Database to be Booted');
  });
}, 1000);

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
 * Regex Checker to check the incoming string is matching a predefined rules or not
 * @param  String raw_string String to be checked
 * @return Boolean           Check Result
 */
const hlp_check = (raw_string) => {
  return (/^[a-zA-Z0-9][a-zA-Z0-9.-]{1,30}[a-zA-Z0-9]$/.test(hlp_sanitze(raw_string)));
};

const hlp_rabbit = new Rabbit('dns-in');

/**
 * GET All DNS Entries
 * Sequelize does not support Stats, but Sequelize.authenticate is useful
 * for testing the MySQL is alive or dead
 */
router.get('/', (req, res, next) => {
  DNS.findAll().then((rsvp) => {
    res.json(rsvp);
  }).catch((err) => {
    return next(err);
  });
});

/**
 * Get ONE Entry by ID
 */
router.get('/:id', (req, res, next) => {
  DNS.findById(hlp_sanitze(req.params.id)).then((rsvp) => {
    res.json(rsvp);
  }).catch((err) => {
    return next(err);
  });
});

router.get('/search/name/:name', (req, res, next) => {
  if (hlp_check(req.params.name)) {
    DNS.findAll({
      where: {
        name: hlp_sanitze(req.params.name)
      }
    }).then((rsvp) => {
      res.json(rsvp);
    }).catch((err) => {
      return next(err);
    });
  } else {
    res.sendStatus(400);
  }
});

router.get('/search/ipv4/:ipv4', (req, res, next) => {
  if (IP.isV4Format(req.params.ipv4)) {
    DNS.findAll({
      where: {
        ipv4address: hlp_sanitze(req.params.ipv4)
      }
    }).then((rsvp) => {
      res.json(rsvp);
    }).catch((err) => {
      return next(err);
    });
  } else {
    res.sendStatus(400);
  }
});

router.get('/search/ipv4/:ipv6', (req, res, next) => {
  if (IP.isV6Format(decodeURIComponent(req.params.ipv6))) {
    DNS.findAll({
      where: {
        ipv4address: hlp_sanitze(decodeURIComponent(req.params.ipv6))
      }
    }).then((rsvp) => {
      res.json(rsvp);
    }).catch((err) => {
      return next(err);
    });
  } else {
    res.sendStatus(400);
  }
});


/**
 * Health Check Endpoint.
 */
router.get('/stats', (req, res, next) => {
  DNS.describe().then(() => {
    res.sendStatus(200);
  }).catch((err) => {
    return next(err);
  });
});

module.exports = router;
