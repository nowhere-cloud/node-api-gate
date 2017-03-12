'use strict';

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Syslog = require('../model/syslog');
const qs = require('querystring');

/**
 * Mongoose Stuffs
 */
mongoose.connect(process.env.MONGODB_URI);

/**
 * Route Preprocess: Add JSON Header to reduce code dupe
 */
const pp_json_header = (req, res, next) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  next();
};

/**
 * Sanitze Input String
 * @param  String raw_string Raw String, such as from user input
 * @return String            Sanitzed String
 */
const hlp_sanitze = (raw_string) => {
  return qs.escape(raw_string);
};

/**
 * GET All Syslog Records
 */
router.get('/', pp_json_header, (req, res, next) => {
  let index = 0;
  let stream = Syslog.find({}, null, { sort: { $natural: 1 } }).lean().cursor();
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
  Syslog.collection.stats((err, doc) => {
    if (err) return next(err);
    // Remove useless Key from doc
    delete doc.wiredTiger;
    delete doc.indexDetails;
    // Render the result
    res.json(doc);
  });
});

/**
 * Get Tags of entries in the Syalog Collection
 * http://stackoverflow.com/questions/6043847/how-do-i-query-for-distinct-values-in-mongoose
 */
router.get('/tag', (req, res, next) => {
  Syslog.aggregate([
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
  res.setHeader('X-PARAM-R', req.params.tag);
  res.setHeader('X-PARAM-S', hlp_sanitze(decodeURIComponent(req.params.tag)));
  let index = 0;
  let stream = Syslog.find({
    'tag': hlp_sanitze(decodeURIComponent(req.params.tag))
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
  Syslog.aggregate([
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
  let stream = Syslog.find({
    'hostname': hlp_sanitze(req.params.hostname)
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
  Syslog.aggregate([
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
  let stream = Syslog.find({
    'facility': hlp_sanitze(req.params.facility)
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
  Syslog.aggregate([
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
  let stream = Syslog.find({
    'severity': hlp_sanitze(req.params.severity)
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

router.get('/:id', (req, res, next) => {
  Syslog.findById(hlp_sanitze(req.params.id), (err, doc) => {
    if (err) return next(err);
    res.json(doc);
  });
});

module.exports = router;
