
'use strict';

const express = require('express');
const router = express.Router();
const models  = require('../models');

const IP = require('ip');
const Sanitizer = require('../helper/strig-sanitize');

/**
 * Search by Name
 * @type {Object}
 */
router.get('/name/:name', (req, res, next) => {
  if (Sanitizer.domaincheck(req.params.name)) {
    models.dns_records.findAll({
      where: {
        name: Sanitizer.sanitize(req.params.name)
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
 * Search by IPv4
 * @type {Object}
 */
router.get('/ipv4/:ipv4', (req, res, next) => {
  if (IP.isV4Format(req.params.ipv4)) {
    models.dns_records.findAll({
      where: {
        ipv4address: Sanitizer.sanitize(req.params.ipv4)
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
 * Search by IPv6
 * @type {Object}
 */
router.get('/ipv4/:ipv6', (req, res, next) => {
  if (IP.isV6Format(req.params.ipv6)) {
    models.dns_records.findAll({
      where: {
        ipv4address: Sanitizer.sanitize(req.params.ipv6)
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

module.exports = router;
