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
PROGRAM=/usr/sbin/hostapd
CONF=/etc/hostapd/hostapd.conf
DAEMONMODE="-B"
LOGFILE=/var/log/hostapd.log

function start() {
    OPTIONS="$DAEMONMODE"
    [ -n "$LOGFILE" ] && OPTIONS="$OPTIONS -f $LOGFILE"
    OPTIONS="$OPTIONS $CONF"

    echo " * Starting hostapd Access Point daemon"
    eval $PROGRAM $OPTIONS
}

function stop() {
    echo " * Stopping hostapd Access Point daemon"
    killall $PROGRAM
}

function debug() {
    stop
    DAEMONMODE="-dd"
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