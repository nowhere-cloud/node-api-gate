'use strict';

const express = require('express');
const router = express.Router();
const models  = require('../models');
const Checker = require('../helper/dns-check');

/**
 * SubApp for handling some group of functions
 */
const search = require('./dns-search');
const create = require('./dns-create');

/**
 * Route Preprocess: Add JSON Header to reduce code dupe
 */
const pp_json_header = (req, res, next) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  next();
};

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

/**
 * forward all search to related SubApp
 */
router.use('/search', search);

router.use('/create', create);

/**
 * Get ONE Entry by ID
 */
router.route('/:id')
  .get((req, res, next) => {
    Checker.normalizeid(req.params.id).then((id) => {
      return models.dns_records.findById(id);
    }).then((rsvp) => {
      res.json(rsvp);
    }).catch((err) => {
      return next(err);
    });
  }).patch((req, res, next) => {
    let uid = 0;
    let obj = {};
    Checker.normalizeid(req.params.id).then((id) => {
      uid = id;
      return Checker.checksubmit(req.body);
    }).then((parsed) => {
      obj = parsed;
      return models.dns_records.findById(uid);
    }).then((instance) => {
      console.log(obj);
      return instance.update(obj);
    }).then((result) => {
      res.json(result);
    }).catch((err) => {
      return next(err);
    });
  }).delete((req, res, next) => {
    Checker.normalizeid(req.params.id).then((id) => {
      return models.dns_records.findById(id);
    }).then((instance) => {
      return instance.destroy();
    }).then((result) => {
      res.json(result);
    }).catch((err) => {
      return next(err);
    });
  });

module.exports = router;
