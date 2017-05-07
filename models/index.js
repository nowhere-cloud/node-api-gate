'use strict';

const Sequelize = require('sequelize');
const db        = {};
const env       = process.env.NODE_ENV || 'development';
const config    = require('../config/config')[env];
const sequelize = new Sequelize(config.database, config.username, config.password, config);

// Manual Import Models
db.dns_record   = sequelize.import('./dns_record');
db.User         = sequelize.import('./user');

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
