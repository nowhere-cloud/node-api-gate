'use strict';

module.exports = {
  'development': {
    'dialect': 'sqlite',
    'storage': '/tmp/nowhere-development.sqlite'
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
  // },
  // 'mongo': {
  //   'development': 'mongodb://localhost/nowhere',
  //   'test': 'mongodb://localhost/nowhere-test',
  //   'production': process.env.MONGODB_URI
  }
};
