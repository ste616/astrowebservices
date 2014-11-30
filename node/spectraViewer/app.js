
/**
 * Module dependencies.
 */

var express = require('express');
var app = express();
var server = require('http').Server(app);
var fs = require('fs');
var io = require('socket.io')(server);

server.listen(8001);

var displayDataset = function(dataset) {
  io.on('connection', function(socket) {
    socket.emit('dataset', { 'dataset': dataset });
  });
  
};

app.get('/spectraViewer/:dataset', function(req, res, next) {
  var dr = /^(.*)\/*$/.exec(req.params.dataset);
  res.sendfile(__dirname + '/spectraViewer.html');
  displayDataset(dr[1]);
});

