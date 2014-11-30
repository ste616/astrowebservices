// This is the node.js server for AstroWebServices.com.

var http = require('http');
var url = require('url');
var fs = require('fs');

var server = http.createServer(function(request, response) {
  console.log('Connection.');
  console.log(request);
  var path = url.parse(request.url).pathname;

  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write('hello world');
  response.end();

});

server.listen(8001);
