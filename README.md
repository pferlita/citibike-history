citibike-history
================

A simple web application for displaying historical Citibike information.

Requires: 

nodejs and (express)[expressjs.com] 

Usage:

The application requires Citibike information; in lieu of Citibike providing
historical data, you'll have to crawl it yourself.  It expects to read a JSON
files from the data/ directory in the Citibike API format.

    npm install -g express
    node app
