#!/bin/bash
### BEGIN INIT INFO
# Provides:          wpa
# Required-Start:    $network $syslog $local_fs
# Required-Stop:     $network $syslog $local_fs
# Default-Start:     2 3 4 5
# Default-Stop:      0 1 6
# Short-Description: Start/stop script for wpa supplicant
# Description:       Custom start/stop script for wpa_supplicant.
### END INIT INFO

SELF=`basename $0`
WPA=wpa_supplicant
PROGRAM=/sbin/${WPA}
CONF=/etc/${WPA}/${WPA}.conf
INTERFACE=wlan0
DRIVER=nl80211,wext
DAEMONMODE="-B"
LOGFILE=/var/log/$WPA.log

function start() {
    ip addr flush dev wlan0
    OPTIONS="-c $CONF -i $INTERFACE -D $DRIVER $DAEMONMODE"
    [ -n "$LOGFILE" ] && OPTIONS="$OPTIONS -f $LOGFILE"
    echo " * Starting wpa supplicant"
    eval $PROGRAM $OPTIONS
}

function stop() {
    echo " * Stopping wpa supplicant"
    killall $PROGRAM
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
    echo "Usage: $SELF <start|stop|status|debug>"
    return 2
}

case $1 in
    start|stop|debug|restart|status) $1 ;;
    *) usage ;;
esac