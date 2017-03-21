'use strict';

const IP = require('ip-address');
const Sanitizer = require('./strig-sanitize');
/**
 * Aliasing Native Promise.
 * SMBC is a financial company.
 */
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
  return ipv6.isCorrect();
};

/**
 * Regex Checker to check the incoming string is matching a predefined rules or not
 * @param  {String} raw_string String to be checked
 * @return {Boolean}           Check Result
 */
const domaincheck = (raw_string) => {
  return (/^[a-zA-Z0-9][a-zA-Z0-9.-]{1,30}[a-zA-Z0-9]$/.test(sanitize(raw_string)));
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
    if (!check_ip4(input_object.ipv4address) || !check_ip6(input_object.ipv6address)) {
      reject({
        status: 400,
        error: 'INVALID_IP'
      });
    }
    fulfill({
      type: input_object.type,
      name: input_object.name,
      ipv4address: ip4correctForm(input_object.ipv4address),
      ipv6address: ip6correctForm(input_object.ipv6address),
      cname: input_object.cname
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


module.exports = {
  sanitize: sanitize,
  domaincheck: domaincheck,
  checkIP4: check_ip4,
  checkIP6: check_ip6,
  ip4correctForm: ip4correctForm,
  ip6correctForm: ip6correctForm,
  ip6possibilities: ip6possibilities,
  checksubmit: checksubmit,
  normalizeid: normalize_id
};
