
'use strict';

const express = require('express');
const router = express.Router();
const models  = require('../models');

const IP = require('ip-address');
const Checker = require('../helper/dns-check');

/**
 * Search by Name
 * @type {Object}
 */
router.get('/name/:name', (req, res, next) => {
  if (Checker.domaincheck(req.params.name)) {
    models.dns_records.findAll({
      where: {
        name: Checker.sanitize(req.params.name)
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
  if (Checker.checkIP4(req.params.ipv4)) {
    models.dns_records.findAll({
      where: {
        ipv4address: Checker.ip4correctForm(req.params.ipv4)
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
router.get('/ipv6/:ipv6', (req, res, next) => {
  if (Checker.checkIP6(req.params.ipv6)) {
    models.dns_records.findAll({
      where: {
        ipv6address: { $in: Checker.ip6possibilities(req.params.ipv6) }
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
