#!/bin/sh
# Configure Wifi Access Point.
#
### BEGIN INIT INFO
# Provides: WifiAP
# Required-Start: $remote_fs $syslog $time
# Required-Stop: $remote_fs $syslog $time
# Should-Start: $network $named slapd autofs ypbind nscd nslcd
# Should-Stop: $network $named slapd autofs ypbind nscd nslcd
# Default-Start: 2
# Default-Stop:
# Short-Description: Wifi Access Point configuration
# Description: Sets forwarding, starts hostap, enables NAT in iptables
### END INIT INFO

# turn on forwarding
echo 1 > /proc/sys/net/ipv4/ip_forward

# enable NAT
iptables -t nat -A POSTROUTING -j MASQUERADE