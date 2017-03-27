'use strict';
module.exports = (sequelize, DataTypes) => {
  var DNS = sequelize.define('dns_records', {
    type: { type: DataTypes.STRING(4), allowNull: false, field: 'type' },
    name: { type: DataTypes.STRING(64), allowNull: false },
    ipv4address: { type: DataTypes.STRING(15), allowNull: true },
    ipv6address: { type:DataTypes.STRING(39), allowNull: true },
    cname: { type: DataTypes.STRING(255), allowNull: true }
  }, {
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
    ],
    classMethods: {
      associate: function(models) {
        DNS.BelongsTo(models.user);
      }
    }
  });
  return DNS;
};
