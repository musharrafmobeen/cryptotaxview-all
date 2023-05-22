#!/bin/bash


echo "--------------------------------------------------"  >> /home/azureuser/scripts/logs.txt
alias npm='node --max_old_space_size=100 /usr/bin/npm'

cd /home/azureuser/cryptotaxview/Backend >> /home/azureuser/scripts/logs.txt

if [ -z "$1" ]
then
    echo "No branch provided therefore pulling  $(git branch | head -n1 )" >> /home/azureuser/scripts/logs.txt
    git pull  >> /home/azureuser/scripts/logs.txt
else
    echo "the git branch to pull is $1" >> /home/azureuser/scripts/logs.txt
    git pull $1  >> /home/azureuser/scripts/logs.txt
    if [[ $? -ne 0 ]]
    then
        echo "--------------------------------------------------"  >> /home/azureuser/scripts/logs.txt
        exit 1
    fi
fi

pm2 stop backend-5000  >> /home/azureuser/scripts/logs.txt

git pull >> /home/azureuser/scripts/logs.txt
npm install >> /home/azureuser/scripts/logs.txt
echo "npm install ran sucessfully" >> /home/azureuser/scripts/logs.txt
sleep 5s
npm run build >> /home/azureuser/scripts/logs.txt
echo "npm run build ran sucessfully" >> /home/azureuser/scripts/logs.txt
sleep 5s
pm2 restart backend-5000 >> /home/azureuser/scripts/logs.txt
echo "--------------------------------------------------"  >> /home/azureuser/scripts/logs.txt
