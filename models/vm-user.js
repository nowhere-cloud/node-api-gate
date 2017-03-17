'use strict';
module.exports = (sequelize, DataTypes) => {
  var DNS = sequelize.define('vm_records', {
    uuid: { type: DataTypes.STRING(36), allowNull: false }
  }, {
    indexes: [
      {
        name: 'vm-inst-uuid',
        fields: ['uuid']
      }
    ],
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return DNS;
};
