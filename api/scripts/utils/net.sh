#!/bin/bash

PWD=$(cd `dirname $0` && pwd)

. $PWD/helpers/sudo.sh
. $PWD/helpers/wlan.sh

check_sudo

net_usage() {
  echo "* Print interfaces and statuses *"
  echo "Usage: $0 interfaces"
  echo "Output: interface|ip|broadcast|netmask|mac|link|rx|tx|up|running|wireless|mode"
  echo
  echo "* Configure interface and save it to config *"
  echo "Usage: $0 configure eth0 dhcp" 
  echo "Usage: $0 configure wlan0 static 192.168.10.1 10.10.10.255 255.255.255.0 [02:ab:cd:ef:12:30]" 
  echo
  echo "* Reset interface and remove it from config *"
  echo "Usage: $0 reset wlan0"
  echo 
  echo "* WPA Supplicant *"
  echo "Usage: $0 wpa connect wlan0 ssid passphrase"
  echo "Usage: $0 wpa disconnect wlan0"
  echo "Usage: $0 wpa status wlan0"
  echo "Usage: $0 wpa live-check"
  echo 
}

reset_interface() {
  if [[ $1 == '' ]]; then
    echo "ERROR"
    exit 0
  fi

  local NAME=$1
  local config_path=$PWD/config/interfaces/${NAME}.cfg

  ifconfig $NAME 0.0.0.0
  rm -f $config_path
}

set_interface() {
  if [[ "$2" != 'dhcp' && "$#" -lt 5 ]]; then
    echo "Not enough parameters."
    exit 0
  fi 

  NAME=$1
  MODE=$2
  IP=$3
  BCAST=$4
  NETMASK=$5
  ADDRESS=$6

  reset_interface $NAME
  
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
  
  # Save config 
  local config_path=$PWD/config/interfaces/${NAME}.cfg

  echo "NAME=$NAME" > $config_path
  echo "MODE=$MODE" >> $config_path

  if [[ $MODE == 'static' ]]; then
    echo "IP=$IP" >> $config_path
    echo "BCAST=$BCAST" >> $config_path
    echo "NETMASK=$NETMASK" >> $config_path
    if [[ $ADDRESS != '' ]]; then
      echo "ADDRESS=$ADDRESS" >> $config_path
    fi
  fi

  echo "OK"
}

print_interfaces() {
  local ifaces
  ifaces=`ls /sys/class/net`

  for iface in $ifaces
  do
    echo -n "${iface}"
    echo -n "|"
    echo -n "`ifconfig $iface | grep 'inet addr:' | cut -d: -f2 | awk '{print $1}'`"
    echo -n "|"
    echo -n "`ifconfig $iface | grep 'inet addr:' | cut -d: -f3 | awk '{print $1}'`"
    echo -n "|"
    echo -n "`ifconfig $iface | grep 'inet addr:' | cut -d: -f4 | awk '{print $1}'`"
    echo -n "|"
    echo -n "`ifconfig $iface | grep "Link encap" | awk -F'[ ]+' '{ print $5 }'`"
    echo -n "|"
    echo -n "`ifconfig $iface | grep "Link encap" | awk -F'[: ]+' '{ print $4 }'`"
    echo -n "|"
    echo -n "`ifconfig $iface | awk -F: '/RX bytes/{print $2+0}'`"
    echo -n "|"
    echo -n "`ifconfig $iface | awk -F: '/TX bytes/{print $3+0}'`"
    echo -n "|"
    if [[ `ifconfig $iface | grep "UP"` ]]; then
      echo -n "true"
    else
      echo -n "false"
    fi
    echo -n "|"
    if [[ `ifconfig $iface | grep "RUNNING"` ]]; then
      echo -n "true"
    else
      echo -n "false"
    fi
    echo -n "|"   
    if  [[ -d /sys/class/net/${iface}/wireless ]]; then
      echo -n "true"
    else
      echo -n "false"
    fi
    echo -n "|"
    if [[ ! -f ${PWD}/config/interfaces/${iface}.cfg ]]; then
      echo -n "none" 
    elif [[ `grep -i MODE ${PWD}/config/interfaces/${iface}.cfg | grep dhcp` ]]; then
      echo -n "dhcp"
    else
      echo -n "static"
    fi
    echo ""
  done 
}

if [[ $1 == '--help' ]]; then 
  net_usage
  exit 1
fi

if [[ $1 == 'interfaces' ]]; then
  print_interfaces
  exit 0 
fi

if [[ $1 == 'configure' ]]; then
  iface=$2
  mode=$3
  ip=$4
  bcast=$5
  netmask=$6
  address=$7

  set_interface $iface $mode $ip $bcast $netmask $address
  
  exit 0
fi

if [[ $1 == 'reset' ]]; then
  if reset_interface $2; then
    echo "OK"
  else 
    echo "ERROR"
  fi
fi

if [[ ($1 == 'wpa' && "$#" -ge 3) || ($1 == 'wpa' && $2 == 'live-check') ]]; then
  IFACE=$3
  CONFIG=$PWD/config/interfaces/${IFACE}.cfg
  CURRENT_STATUS=`${PWD}/helpers/wpa.sh --check-status ${IFACE}`

  if ! is_wifi_interface $IFACE; then
    echo "NOT_WIFI_IFACE"
    exit 0
  fi

  if [[ $2 == 'connect' ]]; then
    $PWD/services/wpa.sh $IFACE stop   
    if [ ! -f $CONFIG ]; then
      set_interface $IFACE dhcp 
    fi
    $PWD/helpers/wpa.sh --save-config $IFACE "$4" "$5"      
    $PWD/services/wpa.sh $IFACE start
  elif [[ $2 == 'disconnect' ]]; then
    if [[ $CURRENT_STATUS == DISCONNECTED ]]; then
      echo "ALREADY_DISCONNECTED"
    else
      $PWD/helpers/wpa.sh --remove-config $IFACE 
      $PWD/services/wpa.sh $IFACE stop
    fi
  elif [[ $2 == 'status' ]]; then
    $PWD/helpers/wpa.sh --check-status $IFACE
  elif [[ $2 == 'live-check' ]]; then
    $PWD/helpers/wpa.sh --live-check 
  fi
fi
