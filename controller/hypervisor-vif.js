
'use strict';

const Express = require('express');
const Proxy   = require('express-http-proxy');
const Router = Express.Router();
const URL = require('url');
const Client = require('../helper/amqp-sender');

const Checker   = require('../helper/xen-check');
const Messenger = new Client('hypervisor-net-in');

/**
 * All GET Requests are Proxied Directly to Ruby-Based Middleware
 */
Router.use('/', Proxy('http://xen-rest:4567/', {
  forwardPath: (req, res) => {
    return '/vif' + URL.parse(req.url).path;
  },
  filter: (req, res) => {
    return req.method === 'GET';
  },
  limit: '5mb',
  timeout: 30*1000
}));

Router.post('/create', Checker.pp.userid, (req, res, next) => {
  Checker.generate.vif(req.body).then((rsvp) => {
    return Messenger.send('do.vif.create', rsvp);
  }).then((rsvp) => {
    res.json(rsvp);
  }).catch((err) => {
    return next(err);
  });
});

Router.delete('/:uuid', (req, res, next) => {
  Checker.uuid(req.params.uuid).then((uuid) => {
    return Messenger.send('do.vif.destroy', uuid);
  }).then((rsvp) => {
    res.json(rsvp);
  }).catch((err) => {
    return next(err);
  });
});

Router.route('/:uuid/cable')
  .post((req, res, next) => {
    // Plug Cable
    Checker.uuid(req.params.uuid).then((uuid) => {
      return Messenger.send('do.vif.plug', uuid);
    }).then((rsvp) => {
      res.json(rsvp);
    }).catch((err) => {
      return next(err);
    });
  })
  .delete((req, res, next) => {
    // Unplug Cable
    Checker.uuid(req.params.uuid).then((uuid) => {
      return Messenger.send('do.vif.unplug', uuid);
    }).then((rsvp) => {
      res.json(rsvp);
    }).catch((err) => {
      return next(err);
    });
  });

module.exports = Router;
