'use strict';
module.exports = (sequelize, DataTypes) => {
  var VMDist = sequelize.define('vm_distros', {
    distro: {
      type: DataTypes.STRING(10),
      allowNull: false
    }
  }, {
    timestamps: false,
    classMethods: {
      associate: function(models) {
        VMDist.hasMany(models.vm_templates);
      }
    }
  });
  return VMDist;
};
