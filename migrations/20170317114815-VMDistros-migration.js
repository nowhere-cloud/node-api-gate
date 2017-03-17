'use strict';

module.exports = {
  up: function (queryInterface, DataTypes) {
    return queryInterface.createTable('vm_distros', {
      distroname: {
        type: DataTypes.STRING(20)
      },
      distro: {
        type: DataTypes.ENUM('debianlike', 'rhlike', 'sleslike')
      }
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('vm_distros');
  }
};
