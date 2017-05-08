'use strict';

const amqp    = require('amqplib');
const uuid    = require('uuid/v1');
const Promise = require('bluebird');
const Task_M    = require('../models-mongo').Task;

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
  send(task, payload, userid) {
    let msg = {
      task: task,
      payload: payload,
      uuid: uuid(),
      sent: false,
      user: userid,
      result: {
        Status: 'Unknown'
      }
    };
    let target = this.target;
    let promise = new Promise((fulfill, reject) => {
      Task_M.create(msg).then(() => {
        return amqp.connect(process.env.AMQP_URI);
      }).then((conn) => {
        return conn.createChannel().then((ch) => {
          const q = ch.assertQueue(target);
          return q.then(() => {
            ch.assertQueue(target, { durable: true });
            ch.sendToQueue(target, new Buffer.from(JSON.stringify(msg)), {
              correlationId: msg.uuid
            });
            return ch.close();
          });
        }).finally(() => {
          conn.close();
        });
      }).then(() => {
        return Task_M.update({ uuid: msg.uuid }, { sent: true });
      }).then(() => {
        fulfill({
          task: msg.uuid
        });
      }).catch((err) => {
        reject(err);
      });
    });

    return promise;
  }
}

module.exports = Rabbit;
