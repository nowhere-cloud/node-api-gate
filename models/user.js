'use strict';

module.exports = (sequelize, DataTypes) => {
  var user = DataTypes.define('Users', {
    username: DataTypes.STRING,
    hash: DataTypes.STRING,
    salt: DataTypes.STRING
  }, {
    indexes: [{
      name: 'username',
      fields: ['username']
    }],
    classMethods: {
      associate: function(models) {
        user.hasMany(models.dns_records);
      }
    }
  });
  return user;
};
