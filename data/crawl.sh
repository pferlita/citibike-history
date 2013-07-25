#!/bin/bash

# not much of a 'crawler', but it gets the job done.
while true; do 
  curl 'http://citibikenyc.com/stations/json' > data.$(date +%s).json; 
  sleep 10m; 
done

