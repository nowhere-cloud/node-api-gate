'use strict';

const Express = require('express');
const Router  = Express.Router();
const Models  = require('../models');
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
Router.get('/', (req, res, next) => {
  Models.dns_record.findAll().then((rsvp) => {
    res.json(rsvp);
  }).catch((err) => {
    return next(err);
  });
});

/**
 * Health Check Endpoint.
 */
Router.get('/stats', (req, res, next) => {
  Models.sequelize.authenticate().then(() => {
    res.sendStatus(200);
  }).catch((err) => {
    next({
      status: 503,
      error: err
    });
  });
});

/**
 * forward all search to related SubApp
 */
Router.use('/search', search);

Router.use('/create', create);

/**
 * Get ONE Entry by ID
 */
Router.route('/:id')
  .get((req, res, next) => {
    Checker.normalizeid(req.params.id).then((id) => {
      return Models.dns_record.findById(id);
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
      return Models.dns_record.findById(uid);
    }).then((instance) => {
      return instance.update(obj);
    }).then((result) => {
      res.json(result);
    }).catch((err) => {
      return next(err);
    });
  }).delete((req, res, next) => {
    Checker.normalizeid(req.params.id).then((id) => {
      return Models.dns_record.findById(id);
    }).then((instance) => {
      return instance.destroy();
    }).then((result) => {
      res.json(result);
    }).catch((err) => {
      return next(err);
    });
  });

module.exports = Router;
