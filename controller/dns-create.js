
'use strict';

const Express = require('express');
const Router  = Express.Router();
const Models  = require('../models');
const Checker = require('../helper/dns-check');

/**
 * Search by Name
 * @type {Object}
 */
Router.post('/', Checker.pp.userid, (req, res, next) => {
  Checker.checksubmit(req.body).then((parsed) => {
    return Models.dns_record.create(parsed, {});
  }).then((result) => {
    res.status(201).json(result);
  }).catch((err) => {
    return next(err);
  });
});


module.exports = Router;
