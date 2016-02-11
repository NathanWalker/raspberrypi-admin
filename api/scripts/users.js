'use strict';

const fs          = require('fs');
const path        = require('path');
const crypt       = require('sha512crypt-node').sha512crypt;

let shadowFile    = null;

try {
  fs.accessSync('/etc/shadow');
  shadowFile = fs.readFileSync('/etc/shadow', 'utf8');
} catch (e) {
  shadowFile = fs.readFileSync(path.join(__dirname, 'dummy_files', 'shadow'), 'utf8');
}

function getUsers() {

}

