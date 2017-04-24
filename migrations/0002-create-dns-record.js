'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('dns_records', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      type: {
        type: Sequelize.ENUM('A', 'CNAME', 'MX', 'SOA', 'TXT', 'NS'),
        allowNull: false
      },
      name: {
        type: Sequelize.STRING(64),
        allowNull: false
      },
      ipv4address: {
        type: Sequelize.STRING(15)
      },
      ipv6address: {
        type: Sequelize.STRING(39)
      },
      cname: {
        type: Sequelize.STRING(255)
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      UserId: {
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        }
      }
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('dns_records');
  }
};
