'use strict';

const https = require('https');
const http = require('http');
const Promise = global.Promise;

/**
 * HTTP Healthcheck Helper
 * @param  {String} hostname Target Hostname
 * @param  {Number} port     Taget Port
 * @param  {String} path     Taget Path
 * @return {Promise}
 */
const http_health = (hostname, port, path) => {
  let promise = new Promise((fulfill, reject) => {
    http.get({
      hostname: hostname,
      port: port,
      path: path
    }, function(response) {
      response.on('end', function() {
        fulfill();
      });
    }).on('error', function(exception) {
      reject(exception);
    });
  });
  return promise;
};

/**
 * HTTPS Healthcheck Helper
 * @param  {String} hostname Target Hostname
 * @param  {Number} port     Taget Port
 * @param  {String} path     Taget Path
 * @param  {Boolean} unsafe  Should I Check HTTPS Certificate?
 * @return {Promise}
 */
const https_health = (hostname, port, path, unsafe) => {
  let promise = new Promise((fulfill, reject) => {
    https.get({
      rejectUnauthorized: unsafe,
      hostname: hostname,
      port: port,
      path: path
    }, function(response) {
      response.on('end', function() {
        fulfill();
      });
    }).on('error', function(exception) {
      reject(exception);
    });
  });
};

module.exports = {
  http: http_health,
  https: https_health
};
