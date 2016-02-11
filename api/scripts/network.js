'use strict';

const utils = require('./utils');
const fs    = require('fs');
const path  = require('path');
const spawn = require('child_process').spawnSync;
const bytes = require('bytes').format;

exports.getCurrentData = getCurrentData;
exports.getCurrentSpeed = getCurrentSpeed;
exports.getAllConnections = getAllConnections;

function getCurrentData() {
  let networkData = [];
  let output = null;
  let lines = null;

  if (!utils.isLinux()) {
    output = fs.readFileSync(path.join(__dirname, 'dummy_files', 'net_dev'), 'utf8');
    lines = output.split('\n');
  } 
  else {
    output = spawn('cat', ['/proc/net/dev'], { encoding: 'utf8' });
    lines = output.stdout.split('\n');
  }

  lines.forEach((line, i) => {
    if (i > 1) {
      if (line.trim() !== '' && line.trim().substring(0, 2) !== 'lo') {
        let data = line.split(':');
        let netData = data[1].replace(/[\s\n\r]+/g, ' ').split(' ');

        networkData.push({
          iface:              data[0].trim(),
          received:           netData[1],
          sent:               netData[9],
          received_formatted: bytes(parseInt(netData[1], 10)),
          sent_formatted:     bytes(parseInt(netData[9], 10))
        });
      }
    }
  });

  return networkData;
}

function getCurrentSpeed() {
  let firstData = getCurrentData();

  return new Promise(resolve => {
    setTimeout(() => {
      let data = getCurrentData();

      data.forEach((iface, i) => {
        data[i].download_speed = bytes(parseInt(iface.received, 10) - parseInt(firstData[i].received, 10));
        data[i].upload_speed = bytes(parseInt(iface.sent, 10) - parseInt(firstData[i].sent, 10));
        data[i].received = bytes(parseInt(iface.received, 10));
        data[i].sent = bytes(parseInt(iface.sent, 10));
      });

      resolve(data);
    }, 1000);
  });
}

function getAllConnections() {
  let connections = [];
  let lines;

  if (utils.isLinux()) {
    lines = require('child_process').execSync("netstat -ntu", {stdio: [0], encoding: 'utf8'});
  }
  else {
    lines = fs.readFileSync(path.join(__dirname, 'dummy_files', 'netstat'), 'utf8');
  }

  lines = lines.split('\n');

  lines.forEach((line, i) => {
    if (i > 1 && line.trim() !== '') {
      line = line.replace(/[\s\n\r]+/g, ' ').split(' ');

      connections.push({
        protocol:       line[0],
        local_address:  line[3].split(':')[0],
        local_port:     line[3].split(':')[1],
        remote_address: line[4].split(':')[0],
        remote_port:    line[4].split(':')[1],
        state:          line[5]
      });
    }
  });

  return connections;
}
