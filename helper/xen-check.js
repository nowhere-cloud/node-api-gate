
'use strict';

const Promise = require('bluebird');
const Sanitizer = require('./strig-sanitize');
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
 * The type of uuid used on xenserver is not-really-standard, fallback to regex
 * @param  {String} raw_uuid UUID String to be checked
 * @return {Boolean}         Is this UUID Correct?
 */
const check_uuid_base = (raw_uuid) => {
  return /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/.test(raw_uuid);
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
 * generate meaningful Name, For various stuffs
 * @return {String} generated string
 */
const generate_name = () => {
  return randomWords({ exactly: 2, join: '-' });
};

/**
 * Check if the given installation is within allowed distro
 * @return {Boolean} Accept?
 */
const accpted_distro = ['debianlike', 'rhlike', 'sleslike'];
const check_distro = (input) => {
  // Human-Readable: http://manpages.ubuntu.com/manpages/precise/man1/eliloader.1.html
  // Currently supported values are 'rhlike', 'sleslike', and 'debianlike'.
  return accpted_distro.indexOf(sanitize(input.toLowerCase())) > -1;
};

/**
 * Check if the given installation is within allowed distro
 * @return {Boolean} Accept?
 */
const accepted_unit = ['M', 'G'];
const check_unit = (input) => {
  // Human-Readable: http://manpages.ubuntu.com/manpages/precise/man1/eliloader.1.html
  // Currently supported values are 'rhlike', 'sleslike', and 'debianlike'.
  return accepted_unit.indexOf(sanitize(input)) > -1;
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
        info: accpted_distro
      });
    }
    if (!check_unit(incoming.disk_unit) || !check_unit(incoming.ram_unit)) {
      reject({
        status: 400,
        error: 'INCORRECT_UNIT',
        info: accepted_unit
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
 * @param  {Object} incoming express.js post body
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
      src_vm: src_uuid,
      new_vm_name: (incoming.hasOwnProperty('vm_name') || incoming.vm_name === '') ? generate_name() : sanitize(incoming.vm_name),
      userid: incoming.userid
    });
  });
  return promise;
};

/**
 * Tag // Untag an object
 * @param  {String} target_uuid Target Object UUID
 * @param  {Object} incoming    express.js post body
 * @return {Promise}
 */
const tag = (target_uuid, incoming) => {
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
      ref: target_uuid,
      tag: sanitize(incoming.tag)
    });
  });
  return promise;
};

/**
 * Generate VIF Creation
 * @param  {Object} incoming    express.js post body
 * @return {Promise}
 */
const vif = (target_uuid, incoming) => {
  let promise = new Promise((fulfill, reject) => {
    if (!check_uuid_base(target_uuid)) {
      reject({
        status: 400,
        error: 'INVALID_UUID'
      });
    }
    if (!incoming.hasOwnProperty('vm_slot') || isNaN(parseInt(incoming.vm_slot, 10)) || parseInt(incoming.vm_slot, 10) <= 0) {
      reject({
        status: 400,
        error: 'INVALID_SLOT'
      });
    }
    fulfill({
      vm: incoming.vm_uuid,
      net: incoming.vnet_uuid,
      slot: incoming.vm_slot
    });
  });
  return promise;
};

/**
 * Generate Payload for resizing VDI
 * @param  {String} incoming_uuid UUID Value in URL.
 * @param  {Object} incoming      express.js req.body
 * @return {Promise}
 */
const vdi_resize = (incoming_uuid, incoming) => {
  let promise = new Promise((fulfill, reject) => {
    if (!incoming.hasOwnProperty('vnet_uuid') || !incoming.hasOwnProperty('vm_uuid') || !check_uuid_base(incoming.vnet_uuid) || !check_uuid_base(incoming.vm_uuid)) {
      reject({
        status: 400,
        error: 'INVALID_UUID'
      });
    }
    if (!check_unit(incoming.disk_unit)) {
      reject({
        status: 400,
        error: 'INCORRECT_UNIT',
        info: accepted_unit
      });
    }
    fulfill({
      vdi_ref: incoming.vm_uuid,
      vdi_size: incoming.vdi_size,
      vdi_unit: incoming.vdi_unit
    });
  });
  return promise;
};

/**
 * Generate Payload for Creating Network
 * @param {Object} incoming
 * @return {Promise}
 */
const vnet = (incoming) => {
  let promise = new Promise((fulfill, reject) => {
    fulfill({
      network_name: (incoming.hasOwnProperty('net_name') || incoming.net_name === '') ? generate_name() : sanitize(incoming.net_name),
      userid: incoming.userid
    });
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
  uuid: check_uuid_promise,
  sanitize: sanitize,
  generate: {
    vm_clone_from_tpl: vm_clone_from_template,
    vm_clone: vm_clone,
    tag: tag,
    net: vnet,
    vif: vif,
    vdi_resize: vdi_resize
  },
  pp: {
    userid: pp_userid
  }
};
