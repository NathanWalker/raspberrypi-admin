#!/usr/bin/env node

'use strict';

process.chdir(__dirname);

const config      = require('./config.json');
const path        = require('path');
const Hapi        = require('hapi');
const server      = new Hapi.Server();
const chalk       = require('chalk');
const Superstatic = require('superstatic').server;

const http = Superstatic({
  port: 81,
  cwd: path.join(__dirname, '..', 'dist')
});

server.connection({
  port: config.port,
  routes: {
    cors: true
  }
});

server.route(require('./routes/api'));

const io          = require('socket.io')(server.listener);
const cpu         = require('./scripts/cpu');
const ram         = require('./scripts/ram');
const storage     = require('./scripts/storage');
const net         = require('./scripts/network');
const utils       = require('./scripts/utils');
const apt         = require('./scripts/apt');
const ifconfig    = require('./scripts/net/ifconfig');
const netSettings = require('./scripts/settings/net');

io.sockets.on('connection', (socket) => {

  socket.intervals = [];

  /* Home */
  socket.on('subscribeToUptime', (cb) => {
    cb(utils.getUptime());
  });

  socket.on('subscribeToOSInfo', (cb) => {
    cb(utils.getOSInfo());
  });

  /* CPU */
  socket.on('subscribeToCpuInfo', () => {
    let i = setInterval(() => {
      cpu.getCpuUsage().then((usage) => {
        socket.emit('getCpuInfo', {
          usage: usage
        });
      });
    }, 1000);

    socket.intervals.push(i);
  });

  socket.on('subscribeToCpuLoadAverage', () => {
    let i = setInterval(() => {
      socket.emit('getCpuLoadAverage', cpu.getLoadAverage());
    }, 1000);

    socket.intervals.push(i);
  });

  socket.on('subscribeToCpuTemp', () => {
    let i = setInterval(() => {
      socket.emit('getCpuTemp', cpu.getCpuTemp());
    }, 1000);

    socket.intervals.push(i);
  });

  socket.on('subscribeToCpuData', (cb) => {
    cb(cpu.getCpuData());
  });

  /* Memory */
  socket.on('subscribeToMemoryInfo', () => {
    let i = setInterval(() => {
      socket.emit('getMemoryInfo', ram.getMemoryInfo());
    }, 1000);

    socket.intervals.push(i);
  });

  /* Storage */
  socket.on('subscribeToStorageData', () => {
    socket.emit('getStorageData', storage.getStorageData());
    
    let i = setInterval(() => {
      socket.emit('getStorageData', storage.getStorageData());
    }, 10000);

    socket.intervals.push(i);
  });

  /* Network */
  socket.on('subscribeToNetworkInfo', () => {
    socket.emit('getNetworkInfo', net.getCurrentData());

    let i = setInterval(() => {
      net.getCurrentSpeed().then(data => {
        socket.emit('getNetworkSpeed', data);
      }); 
    }, 1000);

    socket.intervals.push(i);
  });

  socket.on('subscribeToNetworkConnections', () => {
    let i = setInterval(() => {
      socket.emit('getNetworkConnections', net.getAllConnections());
    }, 1000);

    socket.intervals.push(i);
  });

  /* Settings - network */
  socket.on('subscribeToNetInterfaces', (cb) => {
    cb(netSettings.getInterfaces());
  });

  socket.on('subscribeToWifiScan', (iface, cb) => {
    cb(netSettings.scanNetworks(iface));
  });

  socket.on('subscribeToConnectWifi', (data, cb) => {
    cb(netSettings.connectWifi(data));
  });

  /* Settings - update */
  socket.on('subscribeToLastUpdate', (cb) => {
    cb(apt.getLastUpdate());
  });

  socket.on('subscribeToUpdates', (cb) => {
    cb(apt.update());
  });

  socket.on('subscribeToCheckUpgrades', (cb) => {
    cb(apt.checkUpgrades());
  });

  socket.on('subscribeToUpgrade', (cb) => {
    cb(apt.upgrade());
  });

  socket.on('unsubscribe', () => {
    socket.intervals.forEach(i => {
      clearInterval(i);
    });
    socket.intervals = [];
  });

});

server.start(() => {
  http.listen(() => {
    console.log(chalk.green('HTTP Server running at', chalk.yellow('0.0.0.0:81')) + ', ' +
      chalk.green('Socket & API Server running at', chalk.yellow('0.0.0.0:' + server.info.port)));
  });
});