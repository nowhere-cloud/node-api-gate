'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('dns_records', {
      type: { type: Sequelize.STRING(4), allowNull: false, field: 'type' },
      name: { type: Sequelize.STRING(64), allowNull: false },
      ipv4address: { type: Sequelize.STRING(15), allowNull: true },
      ipv6address: { type:Sequelize.STRING(39), allowNull: true },
      cname: { type: Sequelize.STRING(255), allowNull: true }
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('dns_records');
  }
};
