'use strict';

const Express = require('express');
const Router  = Express.Router();
const Models  = require('../models');

const IP      = require('ip-address');
const Checker = require('../helper/dns-check');

/**
 * Search by Name
 * @type {Object}
 */
Router.get('/name/:name', (req, res, next) => {
  if (Checker.domaincheck(req.params.name)) {
    Models.dns_records.findAll({
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
Router.get('/ipv4/:ipv4', (req, res, next) => {
  if (Checker.checkIP4(req.params.ipv4)) {
    Models.dns_records.findAll({
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
Router.get('/ipv6/:ipv6', (req, res, next) => {
  if (Checker.checkIP6(req.params.ipv6)) {
    Models.dns_records.findAll({
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

module.exports = Router;
