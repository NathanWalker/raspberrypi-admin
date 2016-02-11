'use strict';

const spawn = require('child_process').spawnSync;

exports.getStorageData = getStorageData;

function getStorageData() {
  const output = spawn('df', ['-h'], { encoding: 'utf8' });
  const lines = output.stdout.split('\n');
  let data = [];

  lines.forEach(line => {
    if (line.substring(0, 5) === '/dev/') {
      let parseObj = parseLine(line);
      data.push(parseObj);
    }
  });

  return data;
}

function parseLine(line) {
  line = line.replace(/[\s\n\r]+/g, ' ');
  line = line.split(' ');

  return {
    filesystem: line[0],
    size: line[1],
    used: line[2],
    available: line[3],
    used_percent: line[4],
    mounted_on: line[5]
  }
}
