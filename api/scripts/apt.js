'use strict';

const exec  = require('child_process').execSync;
const fs    = require('fs');
const path  = require('path');
const utils = require('./utils');

module.exports = {
  update: update,
  getLastUpdate: getLastUpdate,
  checkUpgrades: checkUpgrades,
  upgrade: upgrade
};

function update() {
  let output;

  if (!utils.isPI()) {
    output = fs.readFileSync(path.join(__dirname, 'dummy_files', 'apt-update'), 'utf8');
  }
  else {
    output = exec('sudo apt-get update', { encoding: 'utf8' });
  }

  return output.split('\n').filter(line => {
    return /Fetched/.test(line);
  });
}

function getLastUpdate() {
  let output;

  if (!utils.isPI()) {
    output = fs.readFileSync(path.join(__dirname, 'dummy_files', 'apt-lastupdate'), 'utf8');
  }
  else {
    output = exec('ls -l /var/cache/apt/pkgcache.bin | cut -d" " -f6,7,8', { encoding: 'utf8' });
  }

  return output.split('\n').filter(line => { return line !== ''; });
}

function checkUpgrades() {
  let output;

  if (!utils.isPI()) {
    output = fs.readFileSync(path.join(__dirname, 'dummy_files', 'apt-upgradeable'), 'utf8');
  }
  else {
    output = exec('sudo apt list --upgradable', { encoding: 'utf8' });
  }

  return output.split('\n').filter(line => {
    return !/Listing/.test(line) && !/N:/.test(line);
  }).filter(line => {
    return line !== '';
  });
}

function upgrade() {
  let output;
  let result = [];

  if (!utils.isPI()) {
    output = fs.readFileSync(path.join(__dirname, 'dummy_files', 'apt-upgraded'), 'utf8');
  }
  else {
    output = exec('sudo apt-get upgrade -y', { encoding: 'utf8' });
    clearAptCache();
  }

  result.push(output.split('\n')[output.split('\n').length - 1]);
  return result;
}

function clearAptCache() {
  exec('sudo rm -rf /var/cache/apt/archives/*');
}
