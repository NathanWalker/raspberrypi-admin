#!/bin/bash

PWD=$(cd `dirname $0` && pwd)

. $PWD/helpers/sudo.sh

check_sudo

. ./net.sh

function configure_network() {
  local config_dir="$PWD/config/interfaces/"

  for config in `ls $config_dir`; do
    . $config_dir$config
    echo -n "Setting up interface $NAME... "
    ifconfig $NAME 0.0.0.0
    ifconfig $NAME down
    if [[ $MODE == 'dhcp' ]]; then
      ifconfig $NAME up
    elif [[ $MODE == 'static' ]]; then
      ifconfig $NAME $IP broadcast $BCAST netmask $NETMASK up
    fi
    if [[ $ADDRESS != '' ]]; then
      ifconfig $NAME down
      ifconfig $NAME hw ether $ADDRESS
      ifconfig $NAME up 
    fi
    echo "Done."
  done
}

function configure_wpa() {
  local config_dir="$PWD/config/wpa/"
  local IFACE

  for config in `ls $config_dir`; do
    IFACE=${config%.*}
    $PWD/services/wpa.sh $IFACE start
  done
}

configure_network
configure_wpa
