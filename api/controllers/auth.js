'use strict';

const CheckCredentials  = require('../scripts/check_credentials');
const JWT               = require('jsonwebtoken');
const config            = require('../config.json');

exports.checkLogin = {
  handler: (request, reply) => {
    const data = JSON.parse(request.payload);
    const status = CheckCredentials.check(data);

    if (status) {
      const jwt = JWT.sign({
        username: request.payload.username
      }, config.token);

      return reply({
        status: true,
        jwt: jwt
      });
    }
    else {
      return reply({
        status: false
      });
    }
  }
};