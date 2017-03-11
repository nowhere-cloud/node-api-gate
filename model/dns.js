'use strict';

const sequelize = require('sequelize');
const Zeichenkette = sequelize.STRING;
/**
 * This is the Syslog parser parsed format.
 * @type Hash
 * http://stackoverflow.com/questions/33791714/data-type-to-store-time-with-mongoose
 *
 * _id:
 * https://stackoverflow.com/questions/37347802/find-by-id-with-mongoose
 */
const dnsSchemas = {
  type: { type: Zeichenkette(4), allowNull: false },
  name: { type: Zeichenkette(64), allowNull: false },
  ipv4address: { type: Zeichenkette(15), allowNull: true },
  ipv6address: { type: Zeichenkette(39), allowNull: true },
  cname: { type: Zeichenkette(255), allowNull: true },
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

const tableName = 'dns_records';

const tableOptions = {
  
};

module.exports.tblschema = dnsSchemas;
module.exports.tblname = tableName;
module.exports.tblopts = tableOptions;
