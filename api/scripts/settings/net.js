'use strict';

const fs        = require('fs');
const path      = require('path');
const utils     = require('../utils');
const exec      = require('child_process').execSync;
const bytes     = require('bytes').format;
const netUtils  = path.resolve(__dirname, '..', 'utils', 'net.sh');
const wifiScan  = path.resolve(__dirname, '..', 'utils', 'wifi_scan.sh');
const wlanUtils = path.resolve(__dirname, '..', 'utils', 'wlan.sh'); 

module.exports = {
  getInterfaces: getInterfaces,
  scanNetworks: scanNetworks,
  connectWifi: connectWifi
};

function getInterfaces() {
  let output;

  if (utils.isPI()) {
    output = exec(netUtils + ' interfaces', { encoding: 'utf8' }).split('\n');
  }
  else {
    output = fs.readFileSync(path.resolve(__dirname, '..', 'dummy_files', 'interfaces'), { encoding: 'utf8' }).split('\n');
  }
  
  return output.filter(i => { return i !== '' && i.split('|')[0].trim() !== 'lo'; }).map(i => {
    let line = i.split('|');
   
    return {
      iface:      line[0],
      ip:         line[1],
      bcast:      line[2],
      netmask:    line[3],
      address:    line[4],
      link:       line[5],
      received:   line[6],
      received_h: bytes(parseInt(line[6], 10)),
      sent:       line[7],
      sent_h:     bytes(parseInt(line[7], 10)),
      up:         line[8],
      running:    line[9],
      wlan:       line[10],
      method:     line[11]
    };
  });
}

function scanNetworks(iface) {
  let output;

  if (utils.isPI()) {
    output = exec(wifiScan + ' ' + iface, { encoding: 'utf8' }).split('\n');
  }
  else {
    output = fs.readFileSync(path.resolve(__dirname, '..', 'dummy_files', 'wifi_scan'), { encoding: 'utf8' }).split('\n');
  }
 
  return output.filter(r => { return r !== ''; }).map(r => {
    let result = r.split('|');
    let frequency = result[3].trim().split(' ').splice(0, 2).join(' ');
    let signalData = result[4].trim().split(' ');   
    let signalPercent = Math.ceil(parseInt(signalData[0].split('/')[0], 10) / 70 * 100) + '%';
    let signalStrength = signalData[2].split('=')[1] + signalData[3];
    let encryption = result[5];
    let encryptionString = '';

    if (/WPA2\ Version/.test(encryption)) {
      encryptionString = 'WPA2';
    }

    if (/WPA\ Version/.test(encryption)) {
      encryptionString = encryptionString === '' ? 'WPA' : encryptionString + '+WPA';
    }

    if (/WEP/.test(encryption)) {
      encryptionString = 'WEP';
    }

    if (encryptionString === '') {
      encryptionString = 'Open';
    } 
 
    return {
      ssid:           result[0].trim(),
      address:        result[1].trim(),
      channel:        result[2].trim(),
      frequency:      frequency,
      signalPercent:  signalPercent,
      signalStrength: signalStrength,
      security:       encryptionString
    };        
  });
}

function connectWifi(data) {
  if (utils.isPI()) {
    let wpaFile = fs.readFileSync('/etc/wpa_supplicant/wpa_supplicant.conf', 'utf8').split('\n');
    wpaFile.forEach((line, k) => {
      if (/ssid/.test(line)) {
        wpaFile[k] = '  ssid="' + data.ssid + '"';
      }
      if (data.security !== 'Open' && /psk/.test(line)) {
        wpaFile[k] = '  psk="' + data.passphrase + '"';
      }
    });
    fs.writeFileSync('/etc/wpa_supplicant/wpa_supplicant.conf', wpaFile.join('\n'), 'utf8');
    
    return exec(wlanUtils + ' ' + data.iface + ' station start'); 
  }  
  else {
    return true;
  }
}
