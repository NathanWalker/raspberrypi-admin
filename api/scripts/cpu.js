'use strict';

const os      = require('os-utils');
const exec    = require('child_process').execSync;
const utils   = require('./utils');

exports.getCpuUsage = getCpuUsage;
exports.getCpuFree = getCpuFree;
exports.getLoadAverage = getLoadAverage;
exports.getCpuTemp = getCpuTemp;
exports.getCpuData = getCpuData;

function getLoadAverage() {
  return {
    '1min':  os.loadavg(1),
    '5min':  os.loadavg(5),
    '15min': os.loadavg(15)
  };
}

function getCpuUsage() {
  return new Promise(resolve => {
    os.cpuUsage((usage) => {
      resolve(usage);
    });
  });
}

function getCpuFree() {
  return new Promise(resolve => {
    os.cpuFree((free) => {
      resolve(free);
    });
  });
}

function getCpuTemp() {
  if (utils.hasTempSensor()) {
    return parseFloat(exec('cat /sys/class/thermal/thermal_zone0/temp'));
  }
  else {
    return parseFloat(Math.floor(Math.random()*(50000-40000+1)+40000)).toFixed(2);
  }
}

function getCpuData() {
  return require('os').cpus();
}
