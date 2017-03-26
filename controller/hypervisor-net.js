
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
    return '/net' + URL.parse(req.url).path;
  },
  filter: (req, res) => {
    return req.method === 'GET';
  },
  limit: '5mb',
  timeout: 30*1000
}));

Router.post('/create', Checker.pp.userid, (req, res, next) => {
  Checker.generate.net(req.body).then((rsvp) => {
    return Messenger.send('do.network.create', rsvp);
  }).then((rsvp) => {
    res.json(rsvp);
  }).catch((err) => {
    return next(err);
  });
});

Router.delete('/:uuid', (req, res, next) => {
  Checker.uuid(req.params.uuid).then((uuid) => {
    return Messenger.send('do.network.destroy', uuid);
  }).then((rsvp) => {
    res.json(rsvp);
  }).catch((err) => {
    return next(err);
  });
});

Router.route('/:uuid/tags')
  .post((req, res, next) => {
    Checker.generate.net_tag(req.params.uuid).then((rsvp) => {
      return Messenger.send('set.network.tag', rsvp);
    }).then((rsvp) => {
      res.json(rsvp);
    }).catch((err) => {
      return next(err);
    });
  })
  .delete((req, res, next) => {
    Checker.generate.net_tag(req.params.uuid).then((rsvp) => {
      return Messenger.send('no.set.network.tag', rsvp);
    }).then((rsvp) => {
      res.json(rsvp);
    }).catch((err) => {
      return next(err);
    });
  });

module.exports = Router;
