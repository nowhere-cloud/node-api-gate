
'use strict';

const sanitizer = require('sanitizer');

/**
 * Sanitze Input String
 * @param  String raw_string Raw String, such as from user input
 * @return String            Sanitzed String
 */
const sanitize = (raw_string) => {
  return sanitizer.sanitize(raw_string);
};

/**
 * Regex Checker to check the incoming string is matching a predefined rules or not
 * @param  String raw_string String to be checked
 * @return Boolean           Check Result
 */
const hlp_check = (raw_string) => {
  return (/^[a-zA-Z0-9][a-zA-Z0-9.-]{1,30}[a-zA-Z0-9]$/.test(sanitize(raw_string)));
};

module.exports.sanitize = sanitize;
module.exports.domaincheck = hlp_check;
