#!/bin/bash

trap "exit 1" TERM
export TOP_PID=$$

function check_sudo() {
  if [ "$(id -u)" != "0" ]; then
    echo "Sorry, you are not root."
    kill -s TERM $TOP_PID 
  fi 
}
