'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('vm_templates', {
      distroname: {
        type: Sequelize.STRING(64),
        allowNull: false
      },
      uuid: {
        type: Sequelize.STRING(36),
        allowNull: false
      },
      repourl : {
        type: Sequelize.STRING(255),
        allowNull: false
      }
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('vm_templates');
  }
};
