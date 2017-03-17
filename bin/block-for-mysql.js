'use strict';

/*
Load Dependencies
 */
const models = require('../models');

const timer = setInterval(() => {
  models.sequelize.authenticate().then(() => {
    console.info('Database Ready, Exiting...');
    clearInterval(timer);
  }).catch((err) => {
    console.error(err.message);
    console.error('Waiting for Database... Retrying in a 1-sec interval...');
  });
}, 1000);
