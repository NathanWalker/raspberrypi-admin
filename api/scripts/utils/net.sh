#!/usr/bin/env bash

print_usage() {
  echo ""
  echo "Usage: $0 interfaces"
  echo "interface|ip|broadcast|netmask|mac|link|rx|tx|up|running|wireless"i
  echo ""
  echo "Usage: $0 configure iface ip bcast netmask [address]"
  echo "Example: $0 configure eth0 192.168.10.1 10.10.10.255 255.255.255.0 02:ab:cd:ef:12:30" 
  echo "" 
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
    if [[ `grep -i $iface /etc/network/interfaces | grep dhcp` ]]; then
      echo -n "dhcp"
    else
      echo -n "static"
    fi
    echo ""
  done 
}

clear_interface() {
  del='false'
  while read -r line; do
    if [[ `echo $line | grep 'auto'` || `echo $line | grep 'iface'` ]]; then
      if [[ `echo $line | grep $1` ]]; then
        del='true'
      else 
        del='false'
      fi
    fi

    if [[ $del == 'true' && $line != '' ]]; then
      sed -i "s/$line//g" /etc/network/interfaces
    fi
  done < /etc/network/interfaces
  sed -i -e '/./b' -e :n -e 'N;s/\n$//;tn' /etc/network/interfaces
} 

if [[ $# -le 0 ]]; then 
  print_usage
  exit
fi

if [[ $1 == 'interfaces' ]]; then
  print_interfaces 
fi

if [[ $1 == 'configure' ]]; then
  iface=$2
  ip=$3
  bcast=$4
  netmask=$5
 
  if ifconfig $iface $ip broadcast $bcast netmask $netmask 2>/dev/null; then
    clear_interface $iface
    file='/etc/network/interfaces'
    echo "auto ${iface}" >> $file
    echo "iface ${iface} inet static" >> $file
    echo "address ${ip}" >> $file
    echo "broadcast ${bcast}" >> $file
    echo "netmask ${netmask}" >> $file
    if [ $6 != "" ]; then
      echo "hwaddress $6" >> $file
      ifconfig $iface down
      ifconfig $iface hw ether $6
      ifconfig $iface up
    fi
    echo "" >> $file
    echo "OK"
  else
    echo "ERROR: Cannot configure interface."
  fi
fi
