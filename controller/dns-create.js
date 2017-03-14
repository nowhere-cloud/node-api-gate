
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
      let instance = models.dns_records.create(parsed, {});
      instance.then(() => {
        res.sendStatus(201);
      }).catch((err) => {
        return next(err);
      });
    }).catch((err) => {
      return next(err);
    });
  })
  .get((req, res, next) => {
    res.sendStatus(400);
  });


module.exports = router;
