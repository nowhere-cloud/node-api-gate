'use strict';
module.exports = function(sequelize, DataTypes) {
  var vm_user = sequelize.define('vm_user', {
    uuid: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        vm_user.belongsTo(models.User, {
          onDelete: 'CASCADE',
          foreignKey: {
            allowNull: false
          }
        });
      }
    }
  });
  return vm_user;
};
