var fs = require('fs');
var util = require('util');
var _ = require('./lodash');

var initialize = function() {
  // read in JSON data from disk
  var data = fs.readdirSync('./data').map(function(f) {
    return JSON.parse(fs.readFileSync('data/' + f));
  });
  
  var first = function(collection) {
    return _.transform(collection, function(result, val, key) { result[key] = val[0]; });
  }

  // pull out the generic station attributes
  var stations = {}
  var bikes = {}
  var docks = {}
  
  for (var i = 0; i < data[0].stationBeanList.length; ++i) {
    var d = data[0].stationBeanList[i];
    var s = {};
    for (var k in d) {
      s[k] = d[k];
    }
    delete s['availableDocks'];
    delete s['availableBikes'];
    
    stations[s.id] = s;
    bikes[s.id] = [];
    docks[s.id] = [];
  }
  
  var times = [];
  var data_by_time = {};
  for (var i = 0; i < data.length; ++i) {
    var t = new Date(data[i].executionTime);
    times[i] = t;
    data_by_time[t] = data[i];
  }
  times = _.sortBy(times, function(date) { return date.getTime(); })
  
  for (var i = 0; i < times.length; ++i) {
    var d = data_by_time[times[i]].stationBeanList;
    var ids = _(stations).keys().groupBy().value();
    for (var j = 0; j < d.length; ++j) {
      var station = d[j];
      var sid = station.id;
      if (typeof(docks[sid]) == 'undefined') {
        continue; 
      }
      bikes[sid].push(station.availableBikes);
      docks[sid].push(station.availableDocks);
      delete ids[sid];
    }
    
    // If we were missing a station for this time period, pad with zeros.
    for (var id in ids) {
      bikes[id].push(0);
      docks[id].push(0);
    }
  }
  
  exports.times = times;
  exports.bikes = bikes;
  exports.docks = docks;
  exports.stations = stations;
  exports.usage_json = JSON.stringify({
    'bikes' : bikes,
    'docks' : docks,
    'times' : times,
  });
  util.log('Initialized with ' + exports.times.length + ' datapoints.');
}

exports.initialize = initialize;
