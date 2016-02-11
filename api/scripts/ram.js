'use strict';

const utils = require('./utils');
const fs    = require('fs');
const path  = require('path');
const spawn = require('child_process').spawnSync;

exports.getMemoryInfo = getMemoryInfo;

function getMemoryInfo() {
  let data = {
    ram: {},
    swap: {}
  };

  let output = null;
  let lines = null;

  if (!utils.isLinux()) {
    output = fs.readFileSync(path.join(__dirname, 'dummy_files', 'free'), 'utf8');
    lines = output.split('\n');
  }
  else {
    output = spawn('free', ['-m'], { encoding: 'utf8' });
    lines = output.stdout.split('\n');
  }

  lines.forEach(line => {
    if (/Mem:/.test(line)) {
      data.ram = parseLine(line);
    }
    if (/Swap:/.test(line)) {
      data.swap = parseLine(line);
    }
  });

  return data;
}

function parseLine(line) {
  line = line.replace(/[\s\n\r]+/g, ' ');
  line = line.split(' ');
  
  return {
    total: line[1],
    used:  line[2],
    free:  line[3]
  }
}
