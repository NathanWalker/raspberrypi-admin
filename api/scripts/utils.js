'use strict';

const fs    = require('fs');
const os    = require('os');
const path  = require('path');
const spawn = require('child_process').spawnSync;

exports.isLinux = isLinux;
exports.isPI = isPI;
exports.hasTempSensor = hasTempSensor;
exports.getOSInfo = getOSInfo;
exports.getUptime = getUptime;
exports.commandExists = commandExists;
exports.install = install;
exports.purge = purge;

function isLinux() {
  return (/linux/.test(process.platform)) ? true : false;
}

function isPI() {
  if (isLinux() && 
      process.arch === 'arm' &&
      /armv/.test(spawn('uname', ['-m'], { encoding: 'utf8' }).output) &&
      hasTempSensor()) {
    return true;
  } 
  else {
    return false;
  }
}

function hasTempSensor() {
  try {
    fs.accessSync('/sys/class/thermal/thermal_zone0/temp');
    return true;
  } catch (e) {
    return false;
  }
}

function getOSInfo() {
  let osInfo = {};
  let lines;

  try {
    fs.accessSync('/etc/os-release');
    lines = spawn('cat', ['/etc/os-release'], { encoding: 'utf8' }).output.split('\n');
  } catch (e) {
    lines = fs.readFileSync(path.join(__dirname, 'dummy_files', 'os-release'), 'utf8').split('\n');
  }

  lines.forEach(line => {
    line = line.replace(/\"/g, '');
    line = line.split('=');
    osInfo[line[0]] = line[1];
  });

  return osInfo;
}

function getUptime() {
  return os.uptime();
}

function commandExists(cmd) {
  let output = spawn('hash', [cmd], { encoding: 'utf8' }).output;
  return output[2] === '' ? true : false;
}

function install(service) {
  return spawn('sudo', ['apt-get', 'install', service, '-y']);
}

function purge(service) {
  return spawn('sudo', ['apt-get', 'purge', service, '-y']);
}
