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
      models.dns_records.findById(id).then((rsvp) => {
        res.json(rsvp);
      }).catch((err) => {
        return next(err);
      });
    }).catch((err) => {
      return next(err);
    });
  })
  .patch((req, res, next) => {
    let instance = models.dns_records.findById(Checker.sanitize(req.params.id));
    instance.then(() => {
      Checker.checksubmit(req.body).then((parsed) => {
        instance.set(parsed).then(() => {
          res.sendStatus(200);
        }).catch((err) => {
          return next(err);
        });
      }).catch((err) => {
        return next(err);
      });
    }).catch((err) => {
      return next(err);
    });
  })
  .delete((req, res, next) => {
    let instance = models.dns_records.findById(Checker.sanitize(req.params.id));
    instance.then(() => {
      instance.destroy().then(() => {
        res.sendStatus(200);
      }).catch((err) => {
        return next(err);
      });
    }).catch((err) => {
      return next(err);
    });
  });

module.exports = router;
