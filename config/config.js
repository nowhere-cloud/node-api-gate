'use strict';

module.exports = {
  'development': {
    'dialect': 'sqlite',
    'storage': ':memory:'
  },
  'test': {
    'dialect': 'sqlite',
    'storage': ':memory:'
  },
  'production': {
    'username': process.env.MYSQL_USER,
    'password': process.env.MYSQL_PASS,
    'database': process.env.MYSQL_DB,
    'host': 'mysql',
    'dialect': 'mysql',
    // disable logging; default: console.log
    // https://stackoverflow.com/questions/28927836/prevent-sequelize-from-outputting-sql-to-the-console-on-execution-of-query
    'logging': false
  }
};
