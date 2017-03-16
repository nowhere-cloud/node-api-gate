'use strict';

const amqp = require('amqplib');
const debug = require('debug')('node-apimanager:amqp-sender');

class Rabbit {
  constructor(uri, monitor) {
    this.URI = uri;
    this.listen = monitor;
  }

  process(msg) {
    let msgContent = JSON.parse(msg.content.toString());
    debug(' [*] RECV @ %s', msg.properties.correlationId.toString());
  }

  listenQueue() {
    let listen = this.listen;
    let process_me = this.process;
    amqp.connect(this.URI).then((conn) => {
      return conn.createChannel();
    }).then((ch) => {
      let ok = ch.assertQueue(listen);
      ok.then(() => {
        ch.consume(listen, process_me, { noAck: true });
      });
      return ok;
    }).catch((err) => {
      debug(err);
    });
  }
}

const listener = new Rabbit(process.env.AMQP_URI, process.env.LISTEN_Q);
listener.listenQueue();
