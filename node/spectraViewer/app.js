
/**
 * Module dependencies.
 */

var express = require('express');
var app = express();
var server = require('http').Server(app);
var fs = require('fs');
var io = require('socket.io')(server);

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

var displayDataset = function(dataset) {
  io.on('connection', function(socket) {
    socket.emit('dataset', { 'dataset': dataset });
  });
  
};

app.get('/view/:dataset', function(req, res, next) {
  var dr = /^(.*)\/*$/.exec(req.params.dataset);
  res.sendFile('./spectraViewer.html');
  displayDataset(dr[1]);
});

server.listen(8001);
