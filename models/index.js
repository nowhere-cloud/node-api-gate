'use strict';

const Sequelize = require('sequelize');
const db        = {};
const env       = process.env.NODE_ENV || 'development';
const config    = require('../config/config')[env];
const sequelize = new Sequelize(config.database, config.username, config.password, config);

// Manual Import Models
db.dns_record   = sequelize.import('./dns_record');
db.Task         = sequelize.import('./task');
db.User         = sequelize.import('./user');
db.vm_distro    = sequelize.import('./vm-distro');
db.vm_template  = sequelize.import('./vm-template');
db.vm_user      = sequelize.import('./vm-user');

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
