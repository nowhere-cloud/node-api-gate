'use strict';
module.exports = function(sequelize, DataTypes) {
  var task = sequelize.define('Task', {
    type: DataTypes.STRING,
    uuid: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        task.belongsTo(models.User);
      }
    }
  });
  return task;
};
