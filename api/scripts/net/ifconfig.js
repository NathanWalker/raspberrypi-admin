'use strict';

const exec   = require('child_process').execSync;
const fs      = require('fs');
const path    = require('path');
const utils   = require('../utils');

module.exports = {
  getInterfaces:  getInterfaces,
  getInterface:   getInterface,
  up:             up,
  down:           down
};

function getInterfaces() {
  let output;

  if (utils.isLinux()) {
    output = exec('ifconfig', { encoding: 'utf8' });
  }
  else {
    output = fs.readFileSync(path.join(__dirname, '..', 'dummy_files', 'ifconfig'), 'utf8');
  }

  let ifaces = output.trim().split('\n\n').map(parseBlock);
  ifaces = mergeWLANData(ifaces);

  return ifaces;
}

function getInterface(iface) {
  let output = exec('ifconfig ' + iface, { encoding: 'utf8' });
  data = output.trim().split('\n\n').map(parseBlock);
  data = mergeWLANData(iface);

  return data;
}

function up(options) {
  const args = [iface]
    .concat(Object.keys(options).map(o => { return o; }))
    .concat(['up']);

  return exec('ifconfig ' + args.join(' '));
}

function down(iface) {
  return spawn('ifconfig', [iface, 'down']);
}

function mergeWLANData(ifaces) {
  let output;

  if (utils.isLinux()) {
    output = exec('iwconfig', { encoding: 'utf8' });
  }
  else {
    output = fs.readFileSync(path.join(__dirname, '..', 'dummy_files', 'iwconfig'), 'utf8');
  }

  let wlans = output.trim().split('\n\n').map(parseWLANBlock)
    .map(i => { return Object.assign(i, { wlan: !!i.ieee ? true : false }); });

  wlans.forEach((wlan, k) => {
    let index = ifaces.findIndex(x => x.interface === wlan.interface);
    if (index !== -1) {
      ifaces[index] = Object.assign(ifaces[index], wlan);
    }
  });

  return ifaces;
};

function parseBlock(block) {
  let data = {};

  const regexes = {
    interface: { 
      pattern: /^([^\s]+)/, 
      type: 'default'
    },
    link: {
      pattern: /Link encap:\s*([^\s]+)/,
      type: 'lower'
    },
    address: {
      pattern: /HWaddr\s+([^\s]+)/,
      type: 'lower'
    },
    ipv6_address: {
      pattern: /inet6\s+addr:\s*([^\s]+)/,
      type: 'default'
    },
    ipv4_address: {
      pattern: /inet\s+addr:\s*([^\s]+)/,
      type: 'default'
    },
    ipv4_broadcast: {
      pattern: /Bcast:\s*([^\s]+)/,
      type: 'default'
    },
    ipv4_subnet_mask: {
      pattern: /Mask:\s*([^\s]+)/,
      type: 'default'
    },
    up: {
      pattern: /UP/,
      type: 'bool'
    },
    broadcast: {
      pattern: /BROADCAST/,
      type: 'bool'
    },
    running: {
      pattern: /RUNNING/,
      type: 'bool'
    },
    multicast: {
      pattern: /MULTICAST/,
      type: 'bool'
    },
    loopback: {
      pattern: /LOOPBACK/,
      type: 'bool'
    }
  };

  Object.keys(regexes).forEach(k => {
    let regex = new RegExp(regexes[k].pattern);

    if (block.match(regex)) {
      if (regexes[k].type === 'default') {
        data[k] = block.match(regex)[1];
      }
      else if (regexes[k].type === 'lower') {
        data[k] = block.match(regex)[1].toLowerCase();
      }
      else if (regexes[k].type === 'bool') {
        data[k] = block.match(regex) ? true : false;
      }
    }
  });

  return data;
}

function parseWLANBlock(block) {
  if (!block) { return; }

  let data = {};

  const regexes = {
    interface: { 
      pattern: /^([^\s]+)/, 
      type: 'default'
    },
    access_point: {
      pattern: /Access Point:\s*([A-Fa-f0-9:]{17})/,
      type: 'lower'
    },
    frequency: {
      pattern: /Frequency[:|=]\s*([0-9\.]+)/,
      type: 'float'
    },
    ieee: {
      pattern: /IEEE\s*([^\s]+)/,
      type: 'lower'
    },
    mode: {
      pattern: /Mode[:|=]\s*([^\s]+)/,
      type: 'lower'
    },
    noise: {
      pattern: /Noise level[:|=]\s*([0-9]+)/,
      type: 'integer'
    },
    quality: {
      pattern: /Link Quality[:|=]\s*([0-9]+)/,
      type: 'integer'
    },
    sensitivity: {
      pattern: /Sensitivity[:|=]\s*([0-9]+)/,
      type: 'integer'
    },
    signal_level: {
      pattern: /Signal level[:|=]\s*([0-9]+)/,
      type: 'integer'
    },
    ssid: {
      pattern: /ESSID[:|=]\s*"([^"]+)"/,
      type: 'default'
    },
    multicast: {
      pattern: /unassociated/,
      type: 'bool'
    }
  };

  Object.keys(regexes).forEach(k => {
    let regex = new RegExp(regexes[k].pattern);

    if (block.match(regex)) {
      if (regexes[k].type === 'default') {
        data[k] = block.match(regex)[1];
      }
      else if (regexes[k].type === 'lower') {
        data[k] = block.match(regex)[1].toLowerCase();
      }
      else if (regexes[k].type === 'bool') {
        data[k] = block.match(regex) ? true : false;
      }
      else if (regexes[k].type === 'integer') {
        data[k] = parseInt(block.match(regex), 10);
      }
      else if (regexes[k].type === 'float') {
        data[k] = parseFloat(block.match(regex));
      }
    }
  });

  return data;
}
