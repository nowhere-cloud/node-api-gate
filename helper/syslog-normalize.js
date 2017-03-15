'use strict';

// Extracted from Syslog Sourcecode to make sure the value fits
const severity = 'Emergency Alert Critical Error Warning Notice Informational Debug'.toLowerCase().split(' ');
const Sanitizer = require('./strig-sanitize');
const Promise = global.Promise;

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
  return (severity.indexOf(Sanitizer.sanitize(string.toLowerCase())) > -1);
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
 * Normalizing Severity Value to support search from word.
 * @param  {String} raw_value Received Value from URI
 * @return {Integer}          Parsed response
 */
const normalizer_s = (raw_value) => {
  let s_type = parseInt(raw_value, 10);
  let promise = new Promise((fulfill, reject) => {
    if (isNaN(s_type) && ArraySeverityIsContains(s_type)) {
      fulfill(ArraySeverityPosition(s_type));
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

const normalizer_f = (raw_value) => {
};

module.exports.severity = normalizer_s;
module.exports.facility = normalizer_f;
module.exports.sanitize = sanitize;
