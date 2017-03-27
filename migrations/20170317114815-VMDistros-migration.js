'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('vm_distros', {
      distroname: {
        type: Sequelize.STRING(20)
      },
      distro: {
        type: Sequelize.ENUM('debianlike', 'rhlike', 'sleslike')
      }
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('vm_distros');
  }
};
