'use strict';

const amqp    = require('amqplib/callback_api');
const uuid    = require('uuid/v1');
const Promise = require('bluebird');
const Task    = require('../models-mongo').Task;

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
   * @param  {String} task    Task
   * @param  {Any}    paylaod Job Payload
   * @return {Promise}
   */
  send(task, payload) {
    let msg = {
      task: task,
      payload: payload,
      uuid: uuid(),
      sent: false,
      result: {}
    };
    let task_inst = new Task(msg);
    let target = this.target;
    let promise = new Promise((fulfill, reject) => {
      task_inst.save((err) => {
        if (err) return reject(err);
        amqp.connect(process.env.AMQP_URI, (err, conn) => {
          if (err) return reject(err);
          conn.createChannel((err, ch) => {
            if (err) return reject(err);
            ch.assertQueue(target, { durable: true });
            ch.sendToQueue(target, new Buffer.from(JSON.stringify(msg)), {
              correlationId: msg.uuid
            });
            ch.close();
          });
          conn.close();
          return fulfill(msg.uuid);
        });
      });
    });
    return promise;
  }
}

module.exports = Rabbit;
