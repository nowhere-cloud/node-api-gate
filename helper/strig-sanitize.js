
'use strict';

const Sanitizer = require('sanitizer');

/**
 * Sanitze Input String
 * @param  {String} raw_string Raw String, such as from user input
 * @return {String}            Sanitzed String
 */
const sanitize = (raw_string) => {
  return Sanitizer.sanitize(raw_string);
};

module.exports.sanitize = sanitize;
