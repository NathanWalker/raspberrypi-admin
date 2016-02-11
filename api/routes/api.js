'use strict';

const Auth = require('../controllers/auth');

module.exports = [
  { method: 'POST', path: '/api/auth/check-login', config: Auth.checkLogin }
];