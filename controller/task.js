'use strict';

const Express   = require('express');
const Router    = Express.Router();
const Mongo     = require('../models-mongo');
const MySQL     = require('../models');
const Normalize = require('../helper/syslog-normalize');

/**
 * Route Preprocess: Add JSON Header to reduce code dupe
 */
const pp_json_header = (req, res, next) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  next();
};

/**
 * GET All Syslog Records
 */
Router.get('/', pp_json_header, (req, res, next) => {
  let index = 0;
  let stream = Mongo.Task.find({}, null, { sort: { $natural: 1 } }).lean().cursor();
  res.write('[');
  stream.on('data', (doc) => {
    res.write((!(index++) ? '' : ',') + JSON.stringify(doc));
  }).on('end', () => {
    res.write(']');
    res.end();
  }).on('error', (err) => {
    return next(err);
  });
});

/**
 * GET DB Stat as Status Check
 */
Router.get('/stats', (req, res, next) => {
  if (Mongo.mongoose.connection.readyState) {
    res.sendStatus(200);
  } else {
    res.sendStatus(503);
  }
});

Router.get('/byuid/stats', (req, res, next) => {
  Mongo.Syslog.aggregate([
    { $group: {
      _id: '$user',
      count: { $sum: 1 }
    }},
    { $sort: { 'count': -1 } }
  ], (err, doc) => {
    if (err) return next(err);
    res.json(doc);
  });
});

Router.get('/byuid/:uid', (req, res, next) => {
  let index = 0;
  let stream = Mongo.Syslog.find({
    'user': Normalize.sanitize(req.params.uid)
  }, null, { sort: { $natural: 1 } }).lean().cursor();
  res.write('[');
  stream.on('data', (doc) => {
    res.write((!(index++) ? '' : ',') + JSON.stringify(doc));
  }).on('end', () => {
    res.write(']');
    res.end();
  }).on('error', (err) => {
    return next(err);
  });
});

/**
 * Get Tags of entries in the Syalog Collection
 * http://stackoverflow.com/questions/6043847/how-do-i-query-for-distinct-values-in-mongoose
 */
Router.get('/bytask/stats', (req, res, next) => {
  Mongo.Syslog.aggregate([
    { $group: {
      _id: '$task',
      count: { $sum: 1 }
    }},
    { $sort: { 'count': -1 } }
  ], (err, doc) => {
    if (err) return next(err);
    res.json(doc);
  });
});

Router.get('/bytask/:task', pp_json_header, (req, res, next) => {
  let index = 0;
  let stream = Mongo.Syslog.find({
    'task': Normalize.sanitize(req.params.task)
  }, null, { sort: { $natural: 1 } }).lean().cursor();
  res.write('[');
  stream.on('data', (doc) => {
    res.write((!(index++) ? '' : ',') + JSON.stringify(doc));
  }).on('end', () => {
    res.write(']');
    res.end();
  }).on('error', (err) => {
    return next(err);
  });
});

/**
 * GET one record from Syslog Dataset
 * Regex: https://stackoverflow.com/questions/136505/searching-for-uuids-in-text-with-regex
 */

Router.get('/:uuid([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})', (req, res, next) => {
  Mongo.Task.findOne({ 'uuid': Normalize.sanitize(req.params.uuid) }, (err, doc) => {
    if (err) return next(err);
    res.json(doc);
  });
});

module.exports = Router;
