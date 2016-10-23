#! /bin/bash
ps -ef | grep mongod | grep -v grep | awk '{print $2}' | xargs kill
ps -ef | grep nodejs | grep -v grep | awk '{print $2}' | xargs kill
sleep 1
exit
