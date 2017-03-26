
'use strict';

const Promise = require('bluebird');
const Sanitizer = require('./strig-sanitize');
const uuid = require('uuid-validate');
const URL = require('url');
const randomWords = require('random-words');

/**
 * Proxy Function of String Sanitzing
 * @param  {String} raw_string Raw String, such as from user input
 * @return {String}            Sanitzed String
 */
const sanitize = (raw_string) => {
  return Sanitizer.sanitize(raw_string);
};

/**
 * Validate if the incomping UUID is valid or not. (Callback)
 * @param  {String} raw_uuid UUID String to be checked
 * @return {Boolean}         Is this UUID Correct?
 */
const check_uuid_base = (raw_uuid) => {
  return uuid(raw_uuid);
};

/**
 * Validate if the incomping UUID is valid or not. (Promise)
 * @param  {String} raw_uuid UUID String to be checked
 * @return {Promise}         Is this UUID Correct?
 */
const check_uuid_promise = (raw_uuid) => {
  let promise = new Promise((fulfill, reject) => {
    if (check_uuid_base(raw_uuid)) {
      fulfill(raw_uuid);
    } else {
      reject({
        status: 400,
        error: 'INVALID_UUID'
      });
    }
  });
  return promise;
};

/**
 * generate meaningful VM Name
 * @return {String} generated string
 */
const generate_name = () => {
  return randomWords({ exactly: 2, join: '-' });
};

/**
 * Check if the given installation is within allowed distro
 * @return {Boolean} Accept?
 */
const check_distro = (input) => {
  // Human-Readable: http://manpages.ubuntu.com/manpages/precise/man1/eliloader.1.html
  // Currently supported values are 'rhlike', 'sleslike', and 'debianlike'.
  const accepted_val = ['debianlike', 'rhlike', 'sleslike'];
  return accepted_val.indexOf(sanitize(input.toLowerCase())) > -1;
};

/**
 * Create a new VM from a Template
 * @param  {Object} incoming_object No Description
 * @return {Promise}
 */
const vm_clone_from_template = (incoming) => {
  let parsed_repo = URL.parse(incoming.repo);
  let parsed_kick = URL.parse(incoming.ks);
  let normalized  = {};
  let promise = new Promise((fulfill, reject) => {
    if (!check_uuid_base(incoming.src) || !check_uuid_base(incoming.network)) {
      reject({
        status: 400,
        error: 'INVALID_UUID'
      });
    }
    if (incoming.repo === '' || incoming.ks === '') {
      reject({
        status: 400,
        error: 'REPO_OR_KS_File_Missing'
      });
    }
    if (parsed_repo.protocol === 'https:' || parsed_kick.protocol === 'https:') {
      reject({
        status: 400,
        error: 'HTTPS_NOT_SUPPORTED_ON_REPO_OR_KICKSTART_URL'
      });
    }
    if (!check_distro(incoming.distro)) {
      reject({
        status: 400,
        error: 'DISTRO_NOT_SUPPORTED',
        info: ['debianlike', 'rhlike', 'sleslike']
      });
    }
    fulfill({
      src_vm: sanitize(incoming.src),
      new_vm_name: incoming.vm_name === '' ? generate_name() : sanitize(incoming.vm_name),
      ks_url: incoming.ks,
      repo_url: incoming.repo,
      distro: sanitize(incoming.distro),
      deb_distro_release: sanitize(incoming.debian_distro),
      network_ref: sanitize(incoming.network),
      disk_size: incoming.disk_size,
      disk_unit: sanitize(incoming.disk_unit),
      ram_size: incoming.ram_size,
      ram_unit: sanitize(incoming.ram_unit),
      userid: incoming.userid
    });
  });
  return promise;
};

/**
 * Clone VM From Template
 * @param  {String} src_uuid Source VM UUID
 * @param  {Object} incoming Post Body
 * @return {Promise}
 */
const vm_clone = (src_uuid, incoming) => {
  let promise = new Promise((fulfill, reject) => {
    if (!check_uuid_base(src_uuid)) {
      reject({
        status: 400,
        error: 'INVALID_UUID'
      });
    }
    fulfill({
      src_vm: uuid,
      new_vm_name: incoming.vm_name === '' ? generate_name() : sanitize(incoming.vm_name),
      userid: incoming.userid
    });
  });
  return promise;
};

/**
 * Tag // Untag a VM
 * @param  {String} target_uuid Target VM UUID
 * @param  {Object} incoming    Post Body
 * @return {Promise}
 */
const vm_tag = (target_uuid, incoming) => {
  let promise = new Promise((fulfill, reject) => {
    if (!check_uuid_base(target_uuid)) {
      reject({
        status: 400,
        error: 'INVALID_UUID'
      });
    }
    if (!incoming.hasOwnProperty('tag') || incoming.tag === '') {
      reject({
        status: 400,
        error: 'TAG_MISSING'
      });
    }
    fulfill({
      src_vm: target_uuid,
      tag: sanitize(incoming.tag)
    });
  });
  return promise;
};

/**
 * Tag // Untag a Network
 * @param  {String} target_uuid Target Network UUID
 * @param  {Object} incoming    Post Body
 * @return {Promise}
 */
const vnet_tag = (target_uuid, incoming) => {
  let promise = new Promise((fulfill, reject) => {
    if (!check_uuid_base(target_uuid)) {
      reject({
        status: 400,
        error: 'INVALID_UUID'
      });
    }
    if (!incoming.hasOwnProperty('tag') || incoming.tag === '') {
      reject({
        status: 400,
        error: 'TAG_MISSING'
      });
    }
    fulfill({
      network: target_uuid,
      tag: sanitize(incoming.tag)
    });
  });
  return promise;
};

/**
 * Route Preprocessor: Check if Userid is included.
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
  uuid: check_uuid_promise,
  sanitize: sanitize,
  generate: {
    vm_clone_from_tpl: vm_clone_from_template,
    vm_clone: vm_clone,
    vm_tag: vm_tag,
    net_tag: vnet_tag
  },
  pp: {
    userid: pp_userid
  }
};
