'use strict';

const amqp = require('amqplib');
const debug = require('debug')('node-apimanager:amqp-sender');

class Rabbit {
  constructor(uri, monitor) {
    this.URI = uri;
    this.listen = monitor;
  }

  listenQueue() {
    let listen = this.listen;
    amqp.connect(this.URI).then(
      (conn) => conn.createChannel().then(
      (ch) => {
        ch.assertQueue(listen).then(
        () => {
          ch.consume(listen, (msg) => {
            let msgContent = JSON.parse(msg.content.toString());
            debug(' [*] RECV @ %s', msg.properties.correlationId.toString());
          }, {
            noAck: true
          });
        });
      })).catch((err) => {
        debug(err);
      });
  }
}

const listener = new Rabbit(process.env.AMQP_URI, process.env.LISTEN_Q);
listener.listenQueue();
