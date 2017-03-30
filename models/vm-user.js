'use strict';
module.exports = function(sequelize, DataTypes) {
  var vm_user = sequelize.define('vm_user', {
    name: DataTypes.STRING,
    uuid: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        vm_user.belongsTo(models.User);
      }
    }
  });
  return vm_user;
};
