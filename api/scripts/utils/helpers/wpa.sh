#!/bin/bash

PWD=$(cd `dirname $0` && cd .. && pwd)

print_usage() {
  echo "Usage: $0 --live-check"
  echo "Usage: $0 --check-status IFACE"
  echo "Usage: $0 --save-config IFACE SSID PASSPHRASE"
  echo "Usage: $0 --remove-config IFACE" 
}

check_status() {
  local iface
  local n
  local tmp 
  iface=$1
  n=1
  while true; do
    if (( $n > 100 )); then
      echo 'DISCONNECTED'
      exit 0
    fi
    if [[ $tmp == 'CONNECTED' ]]; then
      if tail -${n} /var/log/wpa_supplicant.log | grep ${iface} | grep -q 'SSID'; then
        echo -n 'CONNECTED='
        tail -${n} /var/log/wpa_supplicant.log | grep ${iface} | grep 'SSID' | grep -oP "SSID='\K[^']+"
        exit 0
      fi
    fi
    if tail -${n} /var/log/wpa_supplicant.log | grep ${iface} | grep -q 'CTRL-EVENT-CONNECTED'; then
      tmp='CONNECTED'
    elif tail -${n} /var/log/wpa_supplicant.log | grep ${iface} | grep -q 'CTRL-EVENT-DISCONNECTED'; then
      echo 'DISCONNECTED'
      exit 0
    fi
    n=$((n+1))
  done 
}

function save_config() {
  local iface=$1 ssid=$2 psk=$3
  local config=${PWD}/config/wpa/${iface}.cfg

  echo "network={" > $config
  echo "  ssid=\"$ssid\"" >> $config
  echo "  psk=\"$psk\"" >> $config
  echo "}" >> $config
}

function remove_config() {
  local iface=$1
  local config=${PWD}/config/wpa/${iface}.cfg
  rm -f $config
}

if [[ $1 == '' ]]; then
  print_usage
  exit 1
fi

if [[ $1 == '--live-check' ]]; then
  while true; do 
    if tail -1 /var/log/wpa_supplicant.log | grep -q 'CTRL-EVENT-CONNECTED'; then
      echo 'CONNECTED'
      exit 0
    elif tail -1 /var/log/wpa_supplicant.log | grep -q 'WRONG_KEY'; then
      echo 'WRONG_KEY'
      exit 0
    fi
  done
fi

if [[ $1 == '--check-status' && $2 != '' ]]; then
  check_status $2
  exit 0
fi

if [[ $1 == '--save-config' && "$#" -eq 4 ]]; then
  save_config $2 "$3" "$4"
  exit 0 
fi

if [[ $1 == '--remove-config' && "$#" -eq 2 ]]; then
  remove_config $2
fi

