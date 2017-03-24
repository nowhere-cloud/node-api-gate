'use strict';

/**
 * Healthcheck module
 * Based on
 * https://www.tomas-dvorak.cz/posts/nodejs-request-without-dependencies/
 * Code 500: Internal Server Error
 * Code 503: Service Unavailable
 */

const https = require('https');
const http = require('http');
const Promise = require('bluebird');


/**
 * Check if the responsed Status code is within a Good Code Range
 * @param {Number} HTTP Status Code
 */
const check_status_code = (code) => {
  return (code < 200 || code > 299);
};


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
    }, (response) => {
      // handle http errors
      if (check_status_code(response.statusCode)) {
        reject({
          status: response.statusCode,
          error: response.statusMessage
        });
      }
      fulfill();
    }).on('error', (exception) => {
      reject({status: 503, error: exception.code });
    });
  });
  return promise;
};

/**
 * HTTPS Healthcheck Helper
 * @param  {String} hostname Target Hostname
 * @param  {Number} port     Taget Port
 * @param  {String} path     Taget Path
 * @param  {Boolean} unsafe  Turn Off Certificate Check?
 * @return {Promise}
 */
const https_health = (hostname, port, path, unsafe) => {
  let promise = new Promise((fulfill, reject) => {
    https.get({
      rejectUnauthorized: !unsafe,
      hostname: hostname,
      port: port,
      path: path
    }, (response) => {
      // handle http errors
      if (check_status_code(response.statusCode)) {
        reject({
          status: response.statusCode,
          error: response.statusMessage
        });
      }
      fulfill();
    }).on('error', (exception) => {
      reject({status: 503, error: exception.code });
    });
  });
  return promise;
};

module.exports = {
  http: http_health,
  https: https_health
};
