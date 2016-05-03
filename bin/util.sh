#!/bin/bash
# ------------------------------------------------------------------------------
# Utilites
# ------------------------------------------------------------------------------

readonly PID=$$

readonly COLOR_RESET='\x1b[0m'
readonly RED='\x1b[31m'
readonly GREEN='\x1b[32m'

timestamp() {
    date "+%Y%m%d"
}

print_with_color() {
    echo -e "$2[`timestamp`] $1$COLOR_RESET"
}

validate_dependency() {
    command -v $1 > /dev/null 2>&1 || { print_with_color "The program '$1' is currently not installed, exit script." $RED >&2; exit 1; }
}

create_file_if_not_exits() {
    if [ ! -f $1 ]; then
      mkdir -p "`dirname \"$1\"`"
    fi
}
