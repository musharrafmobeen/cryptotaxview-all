#!/bin/bash

if [ -z "$1" ]
then
    echo "WARNING: role not provided. Therefore role not updated"
    exit 0
else
    echo "The role provided is $1"
    role=$1
fi

echo $(pwd)
cat src/config.json
sed -i "/role\"/c\ \ \"role\": \"$role\"," src/config.json
cat src/config.json