'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
/**
 * This is the Syslog parser parsed format.
 * @type Hash
 * http://stackoverflow.com/questions/33791714/data-type-to-store-time-with-mongoose
 *
 * _id:
 * https://stackoverflow.com/questions/37347802/find-by-id-with-mongoose
 */
const vm_task = new Schema({
  task: String,
  payload: Schema.Types.Mixed,
  uuid: String,
  sent: Boolean,
  result: Schema.Types.Mixed
});

module.exports = mongoose.model('Tasks', vm_task);