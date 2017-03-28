'use strict';
module.exports = (sequelize, DataTypes) => {
  var VMDist = sequelize.define('vm_distro', {
    distroname: {
      type: DataTypes.STRING(20)
    },
    distro: {
      type: DataTypes.ENUM('debianlike', 'rhlike', 'sleslike')
    }
  }, {
    timestamps: false,
    classMethods: {
      associate: function(models) {
        VMDist.hasMany(models.vm_template);
      }
    }
  });
  return VMDist;
};
