var express = require('express'), 
  http = require('http'), 
  path = require('path'), 
  fs = require('fs'), 
  util = require('util'), 
  _ = require('lodash'),
  data = require('./lib/data')

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.use(express.compress());
app.use(express.favicon());
app.use(express.logger('default'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));

if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

data.initialize();

setInterval(data.initialize, 1000 * 60);

var stations = function(req, res) {
  res.send(data.stations);
}

var usage = function(req, res) {
  if (typeof (req.query.time) == 'undefined') {
    res.type('json');
    res.send(data.usage_json);
    return;
  }
}

var index = function(req, res) {
  res.sendfile('public/index.html');
};

app.get('/', index);
app.get('/stations', stations);
app.get('/usage', usage);

http.createServer(app).listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});
