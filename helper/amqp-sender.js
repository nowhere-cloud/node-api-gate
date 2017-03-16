'use strict';

const amqp = require('amqplib');
const uuid = require('uuid/v1');
const debug = require('debug')('node-apimanager:amqp-sender');

class Rabbit {
  /**
   * Prepare Message Sender
   * @param  {String} target Message target
   * @return {null}
   */
  constructor(target) {
    this.target = target;
  }

  /**
   * Send Message to RabbitMQ
   * @param  {String} msg    Message Payload
   * @return {null}
   */
  send(msg) {
    let active_uuid = uuid();
    let target = this.target;
    amqp.connect(process.env.AMQP_URI).then((conn) => {
      return conn.createChannel().then((ch) => {
        let q = ch.assertQueue(target, { durable: true });
        return q.then(() => {
          ch.sendToQueue(target, new Buffer.from(JSON.stringify(msg)), {
            correlationId: active_uuid
          });
          return ch.close();
        });
      }).finally(() => {
        conn.close();
      });
    }).catch((err) => {
      debug(err);
    });
    return active_uuid;
  }
}

module.exports = Rabbit;
