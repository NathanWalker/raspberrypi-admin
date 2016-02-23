#!/bin/bash

PWD=$(cd `dirname $0` && cd .. && pwd)
SELF=`basename $0`
WPA=wpa_supplicant
PROGRAM=/sbin/${WPA}
INTERFACE=$1
CONF=$PWD/config/wpa/${INTERFACE}.cfg
DRIVER=nl80211,wext
DAEMONMODE="-B"
LOGFILE=/var/log/$WPA.log

function start() {
    ip addr flush dev $INTEFACE

    OPTIONS="-c $CONF -i $INTERFACE -D $DRIVER $DAEMONMODE"
    [ -n "$LOGFILE" ] && OPTIONS="$OPTIONS -f $LOGFILE"
    echo " * Starting wpa supplicant on interface ${INTERFACE}"
    eval $PROGRAM $OPTIONS
}

function stop() {
    echo " * Stopping wpa supplicant on interface ${INTERFACE}"
    pid=`ps x | grep wpa_supplicant | grep $INTERFACE | awk '{print $1}'`
    kill $pid
}

function debug() {
    stop
    DAEMONMODE="-ddd"
    start
}

function restart() {
    stop
    start
}

function status() {
    pgrep -lf $PROGRAM
}

function usage() {
    echo "Usage: $SELF iface <start|stop|status|debug>"
    return 2
}

case $2 in
    start|stop|debug|restart|status) $2 ;;
    *) usage ;;
esac
