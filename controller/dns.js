'use strict';

const express = require('express');
const router = express.Router();
const models  = require('../models');
const sanitizer = require('sanitize')();
const Rabbit = require('../helper/amqp-sender');
const IP = require('ip');

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
  return sanitizer.value(raw_string, 'string');
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
  models.dns_records.findAll().then((rsvp) => {
    res.json(rsvp);
  }).catch((err) => {
    return next(err);
  });
});

/**
 * Health Check Endpoint.
 */
router.get('/stats', (req, res, next) => {
  models.dns_records.describe().then((rsvp) => {
    res.json(rsvp);
  }).catch((err) => {
    return next(err);
  });
});

router.get('/search/name/:name', (req, res, next) => {
  if (hlp_check(req.params.name)) {
    models.dns_records.findAll({
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
    models.dns_records.findAll({
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
  if (IP.isV6Format(req.params.ipv6)) {
    models.dns_records.findAll({
      where: {
        ipv4address: hlp_sanitze(req.params.ipv6)
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
 * Get ONE Entry by ID
 */
router.get('/:id', (req, res, next) => {
  models.dns_records.findById(hlp_sanitze(req.params.id)).then((rsvp) => {
    res.json(rsvp);
  }).catch((err) => {
    return next(err);
  });
});

module.exports = router;
