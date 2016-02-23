#!/bin/bash

is_interface() {
  [[ -z "$1" ]] && return 1
  [[ -d "/sys/class/net/${1}" ]]
}

is_wifi_interface() {
  which iw > /dev/null 2>&1 && iw dev $1 info > /dev/null 2>&1 && return 0
  if which iwconfig > /dev/null 2>&1 && iwconfig $1 > /dev/null 2>&1; then
    USE_IWCONFIG=1
    return 0
  fi
  return 1
}

get_phy_device() {
  local x
  for x in /sys/class/ieee80211/*; do
    [[ ! -e "$x" ]] && continue
    if [[ "${x##*/}" = "$1" ]]; then
      echo $1
      return 0
    elif [[ -e "$x/device/net/$1" ]]; then
      echo ${x##*/}
      return 0
    elif [[ -e "$x/device/net:$1" ]]; then
      echo ${x##*/}
      return 0
    fi
  done
  echo "Failed to get phy interface" >&2
  return 1 
}

get_adapter_info() {
  local PHY
  PHY=$(get_phy_device "$1")
  [[ $? -ne 0 ]] && return 1
  iw phy $PHY info
}

can_be_sta_and_ap() {
  [[ $USE_IWCONFIG -eq 1 ]] && return 1
  get_adapter_info "$1" | grep -E '{.* managed.* AP.*}' > /dev/null 2>&1 && return 0
  get_adapter_info "$1" | grep -E '{.* AP.* managed.*}' > /dev/null 2>&1 && return 0
  return 1
}

can_be_ap() {
  get_adapter_info "$1" | grep -E '\* AP$' > /dev/null 2>&1 && return 0
  return 1
}
