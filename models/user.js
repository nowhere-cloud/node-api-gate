'use strict';
module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    username: DataTypes.STRING,
    hash: DataTypes.STRING,
    salt: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        User.hasMany(models.vm_user);
        User.hasMany(models.dns_record);
        User.hasMany(models.Task);
      }
    }
  });
  return User;
};
