"use strict";

const amqp = require("amqplib");
const uuid = require("uuid");

module.exports = {
    /**
     * Send Message to RabbitMQ
     * @param  String target Message target
     * @param  String msg    Message Payload
     * @return null
     */
    send: (target, msg) => {
        amqp.connect(process.env.AMQP_URI).then(
            (conn) => conn.createChannel().then(
            (ch) => {
                let q = ch.assertQueue(target, {
                    durable: true
                });
                return q.then(() => {
                    ch.sendToQueue(target, new Buffer.from(JSON.stringify(msg)), {
                        correlationId: uuid
                    });
                    return ch.close();
                });
            }).finally(() => {
                conn.close();
            })).catch((err) => {
                console.warn(err);
            });
    }
};
