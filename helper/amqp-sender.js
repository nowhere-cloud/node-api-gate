'use strict';

const amqp = require('amqplib/callback_api');
const uuid = require('uuid/v1');
const Promise = require('bluebird');

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
    let promise = new Promise((fulfill, reject) => {
      amqp.connect(process.env.AMQP_URI, (err, conn) => {
        if (err) return reject(err);
        conn.createChannel((err, ch) => {
          if (err) return reject(err);
          ch.assertQueue(target, { durable: true });
          ch.sendToQueue(target, new Buffer.from(JSON.stringify(msg)), {
            correlationId: active_uuid
          });
          ch.close();
        });
        conn.close();
        return fulfill(active_uuid);
      });
    });
    return promise;
  }


}

module.exports = Rabbit;
