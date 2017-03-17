'use strict';

module.exports = {
  up: function (queryInterface, DataTypes) {
    return queryInterface.createTable('vm_templates', {
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
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('vm_templates');
  }
};
