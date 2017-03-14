
'use strict';

const express = require('express');
const router = express.Router();
const models  = require('../models');
const checker = require('../helper/dns-check');

/**
 * Search by Name
 * @type {Object}
 */
router.route('/')
  .post((req, res, next) => {
    checker.checksubmit(req.body).then((parsed) => {
      let instance = models.dns_records.create(parsed, {}).then(() => {
        res.json(instance.get());
      }).catch((err) => {
        next(err);
      });
    }).catch((err) => {
      next(err);
    });
  })
  .get((req, res, next) => {
    /**
     * Get should not be processed on create
     */
    res.sendStatus(400);
  });


module.exports = router;
