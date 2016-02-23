#!/bin/bash

. helpers/sudo.sh

check_sudo

if [ "$1" == '' ]; then 
  echo "Usage: $0 iface"
  exit 1
fi

IFACE=$1

a=0
b=0
c=0
d=0
e=0
x=0
while read line
do
   case $line in
    *ESSID* )
        line=${line#*ESSID:}
        essid[$a]=${line//\"/}
        a=$((a + 1))
        ;;
    *Address*)
        line=${line#*Address:}
        address[$b]=$line
        b=$((b + 1))
        ;;
    *Frequency*)
        line=${line#*Frequency:}
        frequency[$d]=$line
        d=$((d + 1))
        ;;
    *Channel* )
        line=${line#*Channel:}
        channel[$c]=$line
        c=$((c + 1))
        ;;
    *Quality* )
        line=${line#*Quality=}
        quality[$e]=$line
        e=$((e + 1))
        ;;
    *IE:* )
        line=${line#*IE:}
        if [[ ! "$line" =~ Unknown* ]]; then
          if [ "$sec[$((a-1))]" == "[0]" ]; then
            sec[$((a-1))]=$line
          else
            sec[$((a-1))]=${sec[$((a-1))]}','$line
          fi
        fi
        ;;
  esac
done < <(iwlist $IFACE scanning 2>/dev/null)

while [ $x -lt ${#essid[@]} ];do
  echo ${essid[$x]} "|" ${address[$x]} "|" ${channel[$x]} "|" ${frequency[$x]} "|" \
       ${quality[$x]} "|" ${sec[$x]}
  (( x++ ))
done

exit 0
