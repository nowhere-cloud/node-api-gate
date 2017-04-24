'use strict';

const IP = require('ip-address');
const Sanitizer = require('./strig-sanitize');
/**
 * Load Bluebird Promise Library.
 */
const Promise = require('bluebird');
const allow_type = ['A', 'CNAME', 'MX'];

/**
 * Proxy Function of String Sanitzing
 * @param  {String} raw_string Raw String, such as from user input
 * @return {String}            Sanitzed String
 */
const sanitize = (raw_string) => {
  return Sanitizer.sanitize(raw_string);
};

/**
 * Check the incoming IPv4 is correct or not
 * @param  {String} r_ip4 IPv4 Being Checked
 * @return {Boolean}      Is this IPv4 Correct?
 */
const check_ip4 = (r_ip4) => {
  let ipv4 = new IP.Address4(r_ip4);
  return ipv4.isCorrect();
};

/**
 * Check if the supplied IP is a correct IPv6 Address
 * @param  {String} r_ip6 IPv6 Being Checked
 * @return {Boolean}      Is this IPv4 Correct?
 */
const check_ip6 = (r_ip6) => {
  let ipv6 = new IP.Address6(r_ip6);
  return ipv6.isValid();
};

/**
 * Regex Checker to check the incoming string is matching a predefined rules or not
 * @param  {String} raw_string String to be checked
 * @return {Boolean}           Check Result
 */
const domaincheck = (raw_string) => {
  return (/^[a-zA-Z0-9][a-zA-Z0-9.-]{1,30}[a-zA-Z0-9]$/.test(sanitize(raw_string)));
};

const check_type = (input) => {
  // Human-Readable: http://manpages.ubuntu.com/manpages/precise/man1/eliloader.1.html
  // Currently supported values are 'rhlike', 'sleslike', and 'debianlike'.
  return allow_type.indexOf(sanitize(input.toUpperCase())) > -1;
};


/**
 * Determine Kind of IP
 * @param  {[type]} raw_ip [description]
 * @return {[type]}        [description]
 */
const kindofIP = (raw_ip) => {
  let type = 'INVALID';
  if (check_ip4(raw_ip)) {
    type = 'IP4';
  } else if (check_ip6(raw_ip)) {
    type = 'IP6';
  }
  return type;
};

/**
 * Get Formatized IPv4
 * @param  {String} raw_ip4 Unprocessed IP4
 * @return {String}         Normalized IP4
 */
const ip4correctForm = (raw_ip4) => {
  let ip4 = new IP.Address4(raw_ip4);
  return ip4.correctForm();
};

/**
 * Get Formatized IPv6
 * @param  {String} raw_ip6 Unprocessed IP6
 * @return {String}         Normalized IP6
 */
const ip6correctForm = (raw_ip6) => {
  let ip6 = new IP.Address6(raw_ip6);
  return ip6.correctForm();
};

/**
 * Get 4in6 Address
 * @param  {String} raw_ip6 Unprocessed IP6
 * @return {String}         4in6 Address
 */
const ip4in6 = (raw_ip6) => {
  let ip6 = new IP.Address6(raw_ip6);
  return ip6.to4in6();
};

/**
 * Aggregated: Get Possible Matches for IPv6
 * @param  {String} raw_ip6 Unprocessed IP6
 * @return {Array}          Possible Values of IPv6
 */
const ip6possibilities = (raw_ip6) => {
  let ip6 = new IP.Address6(raw_ip6);
  return [ip4in6(raw_ip6), ip6correctForm(raw_ip6)];
};

/**
 * Sanitize and Check Submitted DNS Record
 * @param  {Object} input_object JSON Object
 * @return {Promise}
 */
const checksubmit = (input_object) => {
  let promise = new Promise((fulfill, reject) => {
    if (!input_object.hasOwnProperty('type') || !input_object.hasOwnProperty('name')) {
      reject({
        status: 400,
        error: 'FIELDS_MISSING'
      });
    }
    if (input_object.type === '' || input_object.name === '') {
      reject({
        status: 400,
        error: 'FIELDS_EMPTY'
      });
    }
    if (!domaincheck(input_object.name)) {
      reject({
        status: 400,
        error: 'INVALID_DOMAIN_NAME'
      });
    }
    if (input_object.type === 'A' && (!check_ip4(input_object.ipv4address) || !check_ip6(input_object.ipv6address))) {
      reject({
        status: 400,
        error: 'INVALID_IP'
      });
    }
    if ((input_object.type === 'CNAME' || input_object.type === 'MX') && input_object.cname === '') {
      reject({
        status: 400,
        error: 'OPTIONS_EMPTY'
      });
    }
    if (!check_type(input_object.type)) {
      reject({
        status: 400,
        error: 'INVALID_TYPE',
        info: allow_type
      });
    }
    fulfill({
      type: sanitize(input_object.type),
      name: sanitize(input_object.name),
      ipv4address: ip4correctForm(input_object.ipv4address),
      ipv6address: ip6correctForm(input_object.ipv6address),
      cname: sanitize(input_object.cname),
      UserId: sanitize(input_object.userid)
    });
  });
  return promise;
};

/**
 * Parse and Sanitize DNS Entry ID, ported from Express bin/www NormalizePort
 * @param  {String} val Un-Sanitized Record ID
 * @return {Promise}
 */
const normalize_id = (val) => {
  let id = parseInt(val, 10);
  let promise = new Promise((fulfill, reject) => {
    if (isNaN(id)) {
      reject({
        status: 400,
        error: 'INVALID_ID'
      });
    }
    if (id > 0) {
      fulfill(id);
    }
  });
  return promise;
};

/**
 * Route Preprocessor: Check if Userid is included.
 * @param {Object}  req     express.js request
 * @param {Object}  res     express.js response
 * @param {*}       next    express.js callback to next middleware
 */
const pp_userid = (req, res, next) => {
  if (req.body.hasOwnProperty('userid') && !isNaN(parseInt(req.body.userid, 10))) {
    return next();
  } else {
    res.status(403).json({
      status: 403,
      error: 'FORBIDDEN_USERID_MISSING'
    });
  }
};

module.exports = {
  sanitize: sanitize,
  domaincheck: domaincheck,
  checkIP4: check_ip4,
  checkIP6: check_ip6,
  ip4correctForm: ip4correctForm,
  ip6correctForm: ip6correctForm,
  ip6possibilities: ip6possibilities,
  checksubmit: checksubmit,
  normalizeid: normalize_id,
  pp: {
    userid: pp_userid
  }
};
