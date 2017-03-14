
'use strict';

const express = require('express');
const router = express.Router();
const models  = require('../models');
const checker = require('../helper/dns-check');

/**
 * Search by Name
 * @type {Object}
 */
router.post('/', (req, res, next) => {
  checker.checksubmit(req.body).then((parsed) => {
    return models.dns_records.create(parsed, {});
  }).then((result) => {
    res.status(201).json(result);
  }).catch((err) => {
    return next(err);
  });
});


module.exports = router;
