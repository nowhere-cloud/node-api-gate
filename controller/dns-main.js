'use strict';

const express = require('express');
const router = express.Router();
const models  = require('../models');
const Sanitizer = require('../helper/strig-sanitize');
const IP = require('ip');

/**
 * SubApp for handling Search Request
 */
const search = require('./dns-search');

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

/**
 * Get ONE Entry by ID
 */
router.get('/:id', (req, res, next) => {
  models.dns_records.findById(Sanitizer.sanitize(req.params.id)).then((rsvp) => {
    res.json(rsvp);
  }).catch((err) => {
    return next(err);
  });
});

module.exports = router;
