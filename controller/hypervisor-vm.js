
'use strict';

const Express = require('express');
const Proxy   = require('express-http-proxy');
const Router = Express.Router();
const URL = require('url');
const Client = require('../helper/amqp-sender');

const Checker   = require('../helper/xen-check');
const Messenger = new Client('hypervisor-vm-in');

/**
 * All GET Requests are Proxied Directly to Ruby-Based Middleware
 */
Router.use('/', Proxy('http://xen-rest:4567/', {
  forwardPath: (req, res) => {
    return '/vm' + URL.parse(req.url).path;
  },
  filter: (req, res) => {
    return req.method === 'GET';
  },
  limit: '5mb',
  timeout: 30*1000
}));

Router.post('/create', Checker.pp.userid, (req, res, next) => {
  Checker.generate.vm_clone_from_tpl(req.body.payload).then((generated_payload) => {
    return Messenger.send('do.vm.clone.from_template', generated_payload, req.body.userid);
  }).then((rsvp) => {
    res.json(rsvp);
  }).catch((err) => {
    return next(err);
  });
});

Router.post('/:uuid/clone', Checker.pp.userid, (req, res, next) => {
  Checker.generate.vm_clone(req.params.uuid, req.body.payload).then((payload) => {
    return Messenger.send('do.vm.clone', payload, req.body.userid);
  }).then((rsvp) => {
    res.json(rsvp);
  }).catch((err) => {
    return next(err);
  });
});

Router.post('/:uuid/power_on', Checker.pp.userid, (req, res, next) => {
  Checker.uuid(req.params.uuid).then((uuid) => {
    return Messenger.send('set.vm.power_on', uuid, req.body.userid);
  }).then((rsvp) => {
    res.json(rsvp);
  }).catch((err) => {
    return next(err);
  });
});

Router.post('/:uuid/power_off', Checker.pp.userid, (req, res, next) => {
  Checker.uuid(req.params.uuid).then((uuid) => {
    return Messenger.send('set.vm.power_off', uuid, req.body.userid);
  }).then((rsvp) => {
    res.json(rsvp);
  }).catch((err) => {
    return next(err);
  });
});

Router.post('/:uuid/power_reboot', Checker.pp.userid, (req, res, next) => {
  Checker.uuid(req.params.uuid).then((uuid) => {
    return Messenger.send('set.vm.power_reboot', uuid, req.body.userid);
  }).then((rsvp) => {
    res.json(rsvp);
  }).catch((err) => {
    return next(err);
  });
});

Router.post('/:uuid/power_suspend', Checker.pp.userid, (req, res, next) => {
  Checker.uuid(req.params.uuid).then((uuid) => {
    return Messenger.send('set.vm.power_suspend', uuid, req.body.userid);
  }).then((rsvp) => {
    res.json(rsvp);
  }).catch((err) => {
    return next(err);
  });
});

Router.post('/:uuid/power_resume', Checker.pp.userid, (req, res, next) => {
  Checker.uuid(req.params.uuid).then((uuid) => {
    return Messenger.send('set.vm.power_resume', uuid, req.body.userid);
  }).then((rsvp) => {
    res.json(rsvp);
  }).catch((err) => {
    return next(err);
  });
});

Router.post('/:uuid/name', Checker.pp.userid, (req, res, next) => {
  Checker.uuid(req.params.uuid).then((uuid) => {
    return Messenger.send('set.vm.name', {
      vm: uuid,
      name: Checker.sanitize(req.body.payload.name)
    }, req.body.userid);
  }).then((rsvp) => {
    res.json(rsvp);
  }).catch((err) => {
    return next(err);
  });
});

Router.post('/:uuid/tag', Checker.pp.userid, (req, res, next) => {
  Checker.generate.tag(req.params.uuid, req.body.payload).then((rsvp) => {
    return Messenger.send('set.vm.tag', rsvp, req.body.userid);
  }).then((rsvp) => {
    res.json(rsvp);
  }).catch((err) => {
    return next(err);
  });
});

Router.post('/:uuid/tag/rm', Checker.pp.userid, (req, res, next) => {
  Checker.generate.tag(req.params.uuid, req.body.payload).then((rsvp) => {
    return Messenger.send('no.set.vm.tag', rsvp, req.body.userid);
  }).then((rsvp) => {
    res.json(rsvp);
  }).catch((err) => {
    return next(err);
  });
});

module.exports = Router;
