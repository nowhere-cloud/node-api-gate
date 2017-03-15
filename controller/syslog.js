'use strict';

const express = require('express');
const router = express.Router();
const Mongo = require('../models-mongo');
const Sanitizer = require('../helper/strig-sanitize');

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
router.get('/', pp_json_header, (req, res, next) => {
  let index = 0;
  let stream = Mongo.Syslog.find({}, null, { sort: { $natural: 1 } }).lean().cursor();
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
router.get('/stats', (req, res, next) => {
  if (Mongo.mongoose.connection.readyState) {
    res.sendStatus(200);
  } else {
    res.sendStatus(503);
  }
});

/**
 * Get Tags of entries in the Syalog Collection
 * http://stackoverflow.com/questions/6043847/how-do-i-query-for-distinct-values-in-mongoose
 */
router.get('/tag', (req, res, next) => {
  Mongo.Syslog.aggregate([
    { $group: {
      _id: '$tag',
      count: { $sum: 1 }
    }},
    { $sort: { 'count': -1 } }
  ], (err, doc) => {
    if (err) return next(err);
    res.json(doc);
  });
});

router.get('/tag/:tag', pp_json_header, (req, res, next) => {
  let index = 0;
  let stream = Mongo.Syslog.find({
    'tag': Sanitizer.sanitize(req.params.tag)
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
 * GET records from Syslog Dataset by hostname
 */
router.get('/hostname', (req, res, next) => {
  Mongo.Syslog.aggregate([
    { $group: {
      _id: '$hostname',
      count: { $sum: 1 }
    }},
    { $sort: { 'count': -1 } }
  ], (err, doc) => {
    if (err) return next(err);
    res.json(doc);
  });
});

router.get('/hostname/:hostname', pp_json_header, (req, res, next) => {
  let index = 0;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  let stream = Mongo.Syslog.find({
    'hostname': Sanitizer.sanitize(req.params.hostname)
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
 * Get Facilities of entries in the Syalog Collection
 */
router.get('/facility', (req, res, next) => {
  Mongo.Syslog.aggregate([
    { $group: {
      _id: '$facility',
      count: { $sum: 1 }
    }},
    { $sort: { 'count': -1 } }
  ], (err, doc) => {
    if (err) return next(err);
    res.json(doc);
  });
});

router.get('/facility/:facility', pp_json_header, (req, res, next) => {
  let index = 0;
  let stream = Mongo.Syslog.find({
    'facility': Sanitizer.sanitize(req.params.facility)
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
 * Get Serverity of entries in the Syalog Collection
 */
router.get('/severity', (req, res, next) => {
  Mongo.Syslog.aggregate([
    { $group: {
      _id: '$severity',
      count: { $sum: 1 }
    }},
    { $sort: { 'count': -1 } }
  ], (err, doc) => {
    if (err) return next(err);
    res.json(doc);
  });
});

router.get('/severity/:severity', pp_json_header, (req, res, next) => {
  let index = 0;
  let stream = Mongo.Syslog.find({
    'severity': Sanitizer.sanitize(req.params.severity)
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
 */

router.get('/:id([0-9a-f]{24,})', (req, res, next) => {
  Mongo.Syslog.findById(Sanitizer.sanitize(req.params.id), (err, doc) => {
    if (err) return next(err);
    res.json(doc);
  });
});

module.exports = router;
