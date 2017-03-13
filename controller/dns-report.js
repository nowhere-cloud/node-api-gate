'use strict';

const express = require('express');
const router = express.Router();
const models = require('../models');

router.get('/name', (req, res, next) => {
  models.dns_records.findAll({
    group: ['name']
  }).then((rsvp) => {
    res.json(rsvp);
  }).catch((err) => {
    return next(err);
  });
});

router.get('/type', (req, res, next) => {
  models.dns_records.findAll({
    group: ['type']
  }).then((rsvp) => {
    res.json(rsvp);
  }).catch((err) => {
    return next(err);
  });
});

router.get('/ipv4', (req, res, next) => {
  models.dns_records.findAll({
    group: ['ipv4address']
  }).then((rsvp) => {
    res.json(rsvp);
  }).catch((err) => {
    return next(err);
  });
});

router.get('/ipv6', (req, res, next) => {
  models.dns_records.findAll({
    group: ['ipv6address']
  }).then((rsvp) => {
    res.json(rsvp);
  }).catch((err) => {
    return next(err);
  });
});


module.exports = router;
