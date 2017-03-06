"use strict";

const amqp = require("amqplib");
const uuid = require("uuid");

module.exports = {
    send: (target, msg) => {
        amqp.connect(this.AURI).then(
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
