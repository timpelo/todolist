#! /bin/bash
mongod &
sleep 5
nodejs server.js &
sleep 2
exit
