'use strict';

const fs          = require('fs');
const path        = require('path');
const utils       = require('./utils');
const crypt       = require('sha512crypt-node').sha512crypt;

let shadowFile    = null;

if (utils.isPI()) {
  shadowFile = fs.readFileSync('/etc/shadow', 'utf8');
}
else {
  shadowFile = fs.readFileSync(path.join(__dirname, 'dummy_files', 'shadow'), 'utf8');
}

function check(data) {
  if (!data.username || !data.password) {
    return false;
  }

  const shadowLines = shadowFile.split('\n');
  let salt          = null;
  let password      = null;

  shadowLines.forEach(line => {
    if (line.substring(0, data.username.length) === data.username) {
      salt = line.split('$')[2];
      password = line.split(':')[1];
    }
  });

  if (!salt) {
    return false;
  }

  return (password === crypt(data.password, salt)) ? true : false;
}

exports.check = check;
