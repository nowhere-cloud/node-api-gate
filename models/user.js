'use strict';

const passportLocalSequelize = require('passport-local-sequelize');

module.exports = (sequelize, DataTypes) => {
  var user = DataTypes.define('user', {
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
        user.hasMany(models.vm_records);
        user.hasMany(models.dns_records);
      }
    }
  });

  passportLocalSequelize.attachToUser(user, {
    usernameField: 'username',
    hashField: 'hash',
    saltField: 'salt'
  });

  return user;
};
