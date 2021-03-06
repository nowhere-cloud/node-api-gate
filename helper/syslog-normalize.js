'use strict';

const Sanitizer = require('./strig-sanitize');
const Promise = require('bluebird');

// Extracted from Syslog Sourcecode to make sure the value fits
// RFC5424
const severity = 'Emergency Alert Critical Error Warning Notice Informational Debug'.toLowerCase().split(' ');

// Facility String
// RFC3164
const facility = [
  'kern', 'user', 'mail', 'daemon',
  'auth', 'syslog', 'lpr', 'news',
  'uucp', '9', 'authpriv', 'ftp',
  '12', '13', '14', 'cron', 'local0',
  'local1', 'local2', 'local3', 'local4',
  'local5', 'local6', 'local7'
];

/**
 * Proxy Function of String Sanitzing
 * @param  {String} raw_string Raw String, such as from user input
 * @return {String}            Sanitzed String
 */
const sanitize = (raw_string) => {
  return Sanitizer.sanitize(raw_string);
};

/**
 * Check if a severity is correct
 * @param {String} string String to be checked
 * @return {Boolean}
 */
const ArraySeverityIsContains = (string) => {
  return severity.indexOf(Sanitizer.sanitize(string.toLowerCase())) > -1;
};

/**
 * Find the position of a severity string.
 * @param {String} string String to be discovered
 * @return {Number}       String index
 */
const ArraySeverityPosition = (string) => {
  return severity.indexOf(Sanitizer.sanitize(string.toLowerCase()));
};

/**
 * Check if a severity is correct
 * @param {String} string String to be checked
 * @return {Boolean}
 */
const ArrayFacilityIsContains = (string) => {
  return facility.indexOf(Sanitizer.sanitize(string.toLowerCase())) > -1;
};

/**
 * Find the position of a facility string.
 * @param {String} string String to be discovered
 * @return {Number}       String index
 */
const ArrayFacilityPosition = (string) => {
  return facility.indexOf(Sanitizer.sanitize(string.toLowerCase()));
};

/**
 * Normalizing Severity Value to support search from word.
 * @param  {String} raw_value Received Value from URI
 * @return {Integer}          Parsed response
 */
const normalizer_s = (raw_value) => {
  let s_type = parseInt(raw_value, 10);
  let promise = new Promise((fulfill, reject) => {
    if (isNaN(s_type) && ArraySeverityIsContains(raw_value)) {
      fulfill(ArraySeverityPosition(raw_value));
    } else if (s_type >= 0 && s_type <= 7) {
      fulfill(s_type);
    } else {
      reject ({
        status: 400,
        error: 'INVALID_SEVERITY'
      });
    }
  });
  return promise;
};

/**
 * Normalizing Facility Value to support search from word.
 * @param  {String} raw_value Received Value from URI
 * @return {Integer}          Parsed response
 */
const normalizer_f = (raw_value) => {
  let f_type = parseInt(raw_value, 10);
  let promise = new Promise((fulfill, reject) => {
    if (isNaN(f_type) && ArrayFacilityIsContains(raw_value)) {
      fulfill(ArrayFacilityPosition(raw_value));
    } else if (f_type >= 0 && f_type <= 23) {
      fulfill(f_type);
    } else {
      reject ({
        status: 400,
        error: 'INVALID_FACILIY'
      });
    }
  });
  return promise;
};

module.exports.severity = normalizer_s;
module.exports.facility = normalizer_f;
module.exports.sanitize = sanitize;
