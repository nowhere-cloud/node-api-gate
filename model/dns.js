'use strict';

const Sequelize = require('sequelize');
/**
 * This is the Syslog parser parsed format.
 * @type Hash
 * http://stackoverflow.com/questions/33791714/data-type-to-store-time-with-mongoose
 *
 * _id:
 * https://stackoverflow.com/questions/37347802/find-by-id-with-mongoose
 */
const dnsSchemas = {
  type: { type: Sequelize.STRING(4), allowNull: false, field: 'type' },
  name: { type: Sequelize.STRING(64), allowNull: false },
  ipv4address: { type: Sequelize.STRING(15), allowNull: true },
  ipv6address: { type:Sequelize.STRING(39), allowNull: true },
  cname: { type: Sequelize.STRING(255), allowNull: true }
};

const tableName = 'dns_records';

const tableOptions = {
  indexes: [
    {
      name: 'ipv4address',
      fields: ['ipv4address']
    },
    {
      name: 'ipv6address',
      fields: ['ipv6address']
    },
    {
      name: 'name',
      fields: ['name']
    }
  ]
};

module.exports.tblschema = dnsSchemas;
module.exports.tblname = tableName;
module.exports.tblopts = tableOptions;
