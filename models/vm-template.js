'use strict';
module.exports = (sequelize, DataTypes) => {
  var VMTmpl = sequelize.define('vm_templates', {
    distroname: {
      type: DataTypes.STRING(64),
      allowNull: false
    },
    uuid: {
      type: DataTypes.STRING(36),
      allowNull: false
    },
    repourl : {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  }, {
    indexes: [
      {
        name: 'uuid',
        fields: ['uuid']
      }
    ],
    classMethods: {
      associate: function(models) {
        VMTmpl.hasOne(models.vm_distros, { as: 'distro_type' });
      }
    }
  });
  return VMTmpl;
};
