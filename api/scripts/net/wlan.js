'use strict';

const spawn     = require('child_process').spawnSync;
const fs        = require('fs');
const path      = require('path');
const utils     = require('../utils');
const services  = require('../services');
const ifconfig  = require('./ifconfig');

let wlan = {};

// hostapd - Access Point configuration
wlan.hostapd = {
  configFile: utils.isLinux() ? '/etc/hostapd/hostapd.conf' : path.join(__dirname, '..', 'dummy_files', 'hostapd.conf'),
  script: path.join(__dirname, '..', '..', '..', 'scripts', 'ap-configure.sh'),
  log: '/var/log/hostapd.log',

  isInstalled: function() {
    return utils.commandExists('hostapd');
  },

  isEnabled: function() {
    return services.isEnabled('hostapd');
  },

  start: function() {
    return spawn(this.script, ['start']);
  },

  stop: function() {
    return spawn(this.script, ['stop']);
  },

  addConfig: function(config) {
    config.driver = 'nl80211';

    let data = Object.keys(config).map(k => {
      return k + '=' + config[k];
    });

    data.push(' ');
    data = data.map(d => { return d.trim(); });
    fs.appendFileSync(this.configFile, data.join('\n'), 'utf8');

    if (!this.isEnabled()) {
      return this.enable();
    } else {
      return true;
    }
  },

  removeConfig: function(iface) {
    let output = fs.readFileSync(this.configFile, 'utf8').split('\n');
    let regex = new RegExp(iface);
    let fromIndex = output.findIndex(x => regex.test(x));
    let toIndex = output.findIndex((x, i) => x.trim() === '' && i > fromIndex);

    if (fromIndex !== -1) {
      fs.writeFileSync(this.configFile, output.splice(fromIndex, toIndex).join('\n'), 'utf8');
    }
  },

  clearConfig: function() {
    return spawn('>', this.configFile);
  }
};

// WPA Supplicant - Connect to other WLAN
wlan.wpa = {
  
};

module.exports = wlan;
