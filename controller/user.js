'use strict';

const Express   = require('express');
const Router    = Express.Router();
const Sanitizer = require('sanitizer');
const User      = require('../models').User;
const Crypto    = require('crypto');

/**
 * Calculate SHA256 of a specified String
 * @param {String} source Clear text
 * @return {String}       Cipher text
 */
const GenerateSHA256 = (source) => {
  let cleanString = Sanitizer.sanitize(source);
  return Crypto.createHash('sha256').update(cleanString).digest('hex');
};

/**
 * Hash Function of User Password
 * @param {String} raw Clear Text
 * @return {String} Encrypted Password
 */
const PasswordHashFunction = (raw) => {
  let reverse = raw.split('').reverse().join('');
  return GenerateSHA256(`${GenerateSHA256(reverse)}${GenerateSHA256(raw)}${reverse}`);
};

Router.route('/')
  .get((req, res, next) => {
    // UID 1 is the Admin user created with random data
    User.findAll({ where: { $not: [{ id: 1 }] } }).then((data) => {
      res.json(data);
    }).catch((e) => {
      return next(e);
    });
  })
  .post((req, res, next) => {
    User.create({
      username: Sanitizer.sanitize(req.body.username),
      password: PasswordHashFunction(req.body.password)
    }).then(function(user) {
      res.json(user);
    }).catch((err) => {
      return next(err);
    });
  });

Router.post('/validate', (req, res, next) => {
  User.findOne({ where: { username: req.body.username } }).then((user) => {
    if (!user || PasswordHashFunction(req.body.password) !== user.password) {
      res.sendStatus(403);
    }
    res.json(user);
  }).catch((err) => {
    return next(err);
  });
});

Router.route('/byid/:uid')
  .get((req, res, next) => {
    User.findById(Sanitizer.sanitize(req.params.uid)).then(function(user) {
      res.json(user);
    }).catch((err) => {
      return next(err);
    });
  })
  .patch((req, res, next) => {
    User.findById(Sanitizer.sanitize(req.params.uid)).then((user) => {
      return user.update({
        password: PasswordHashFunction(req.body.password)
      });
    }).then(() => {
      req.flash('success', 'Password Updated.');
      return next();
    }).catch((err) => {
      return next(err);
    });
  })
  .delete((req, res, next) => {
    User.findById(Sanitizer.sanitize(req.params.uid)).then((user) => {
      return user.destroy();
    }).then(() => {
      res.sendStatus(200);
    }).catch((err) => {
      return next(err);
    });
  });

Router.get('/byusername/:uid', (req, res, next) => {
  User.findOne({ where: {
    username: Sanitizer.sanitize(req.body.username)
  }}).then((user) => {
    res.json(user);
  }).catch((err) => {
    return next(err);
  });
});

module.exports = {};
