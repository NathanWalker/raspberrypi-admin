'use strict';

const spawn     = require('child_process').spawnSync;
const exec      = require('child_process').execSync;
const fs        = require('fs');
const path      = require('path');
const utils     = require('./utils');

module.exports = {
  isEnabled:  isEnabled,
  list:       list,
  enable:     enable,
  disable:    disable
};

function isEnabled(service) {
  let output;

  if (utils.isLinux()) {
    output = exec('sudo service --status-all | grep ' + service, { stdio: [0], encoding: 'utf8' }).split('\n')[0];
  }
  else {
    let regex = new RegExp(service);
    output = fs.readFileSync(path.join(__dirname, 'dummy_files', 'services'), 'utf8').split('\n')
      .filter(x => {
        return regex.test(x);
      });
  }

  return /\+/.test(output) ? true : false;
}

function list() {
  let output;

  if (utils.isLinux()) {
    output = exec('sudo service --status-all | sort -k2', { stdio: [0], encoding: 'utf8' }).split('\n');
  }
  else {
    output = fs.readFileSync(path.join(__dirname, 'dummy_files', 'services'), 'utf8').split('\n');
  }

  output = output.filter(x => { return x !== ''; });

  return output.map(s => {
    s = s.trim().split(' ');
    return {
      name: s[4],
      enabled: s[1] === '+' ? true : false
    }
  });
}

function enable(service) {
  if (utils.isLinux()) {
    return spawn('sudo', ['service', service, 'enable']);
  }
  else {
    return false;
  }
}

function disable(service) {
  if (utils.isLinux()) {
    return spawn('sudo', ['service', service, 'disable']);
  }
  else {
    return false;
  }
}
