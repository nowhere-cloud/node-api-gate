'use strict';
module.exports = function(sequelize, DataTypes) {
  var dns_record = sequelize.define('dns_record', {
    type: DataTypes.STRING,
    name: DataTypes.STRING,
    ipv4address: DataTypes.STRING,
    ipv6address: DataTypes.STRING,
    cname: DataTypes.STRING
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
        // associations can be defined here
        dns_record.belongsTo(models.User);
      }
    }
  });
  return dns_record;
};
