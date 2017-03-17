'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('vm_distros', [
      {
        distroname: 'Ubuntu',
        distro: 'debianlike'
      },
      {
        distroname: 'CentOS',
        distro: 'rhlike'
      },
      {
        distroname: 'openSUSE',
        distro: 'sleslike'
      }
    ], {});
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('vm_distros', null, {});
  }
};
