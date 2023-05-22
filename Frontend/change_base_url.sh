#!/bin/bash  

if [ -z "$1" ]
then
    echo "baseURL not provided"
    baseURL=192.168.18.52:5000
    exit_status=1
else
    echo "The baseURL provided is $1"
    baseURL=$1
fi

echo "hello world"
echo $(pwd)
cat src/config.json
sed -i "/baseURL/c\   \ \"baseURL\" : \"http://$1\""  src/config.json
cat src/config.json

if [ ! -z "$exit_status" ]
then
    echo "ERROR: No baseURL provided"
    exit $exit_status
fi
