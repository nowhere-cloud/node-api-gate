
'use strict';

const Express = require('express');
const Proxy   = require('express-http-proxy');
const Router = Express.Router();
const URL = require('url');
const Client = require('../helper/amqp-sender');

const Checker   = require('../helper/xen-check');
const Messenger = new Client('hypervisor-blk-in');

/**
 * All GET Requests are Proxied Directly to Ruby-Based Middleware
 */
Router.use('/', Proxy('http://xen-rest:4567/', {
  forwardPath: (req, res) => {
    return '/block/vdi' + URL.parse(req.url).path;
  },
  filter: (req, res) => {
    return req.method === 'GET';
  },
  limit: '5mb',
  timeout: 30*1000
}));

Router.route('/create', (req, res, next) => {
  // Reserved
  res.sendStatus(400);
});

Router.post('/:uuid/resize', Checker.pp.userid, (req, res, next) => {
  Checker.generate.vdi_resize(req.params.uuid, req.body).then((rsvp) => {
    return Messenger.send('do.vdi.resize', rsvp, req.body.userid);
  }).then((rsvp) => {
    res.json(rsvp);
  }).catch((err) => {
    return next(err);
  });
});

Router.post('/:uuid/delete', Checker.pp.userid, (req, res, next) => {
  Checker.uuid(req.params.uuid).then((uuid) => {
    return Messenger.send('do.network.destroy', uuid, req.body.userid);
  }).then((rsvp) => {
    res.json(rsvp);
  }).catch((err) => {
    return next(err);
  });
});

Router.post('/:uuid/tag', Checker.pp.userid, (req, res, next) => {
  Checker.generate.tag(req.params.uuid, req.body.payload).then((rsvp) => {
    return Messenger.send('set.network.tag', rsvp, req.body.userid);
  }).then((rsvp) => {
    res.json(rsvp);
  }).catch((err) => {
    return next(err);
  });
});

Router.post('/:uuid/tag/rm', Checker.pp.userid, (req, res, next) => {
  Checker.generate.tag(req.params.uuid, req.body.payload).then((rsvp) => {
    return Messenger.send('no.set.network.tag', rsvp, req.body.userid);
  }).then((rsvp) => {
    res.json(rsvp);
  }).catch((err) => {
    return next(err);
  });
});

module.exports = Router;
