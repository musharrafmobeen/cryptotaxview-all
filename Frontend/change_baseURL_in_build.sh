#!/bin/bash


if [[ -z "$1" || -z "$2" ]]
then
    echo "Please provide both, the old_ip and the new_ip."
    echo "the format of running command is 'bash change_baseURL_in_build.sh old_ip:old_port new_ip:new_port'"
    exit_status=1
else
    echo "The ip will be changed from $1 to $2"
    sed -i "s/$1/$2/g" static/js/*
fi



