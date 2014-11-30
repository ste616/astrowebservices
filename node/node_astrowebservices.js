// This is the node.js server for AstroWebServices.com.

var http = require('http');
var url = require('url');
var fs = require('fs');

var server = http.createServer(function(request, response) {
  console.log('Connection.');
  console.log(request.url);
  var path = url.parse(request.url).pathname;


  if (/^\/spectraViewer\//.test(path)) {
    // User wants the spectra viewer.
    var dr = /^\/spectraViewer\/(.*)$/.exec(path);
    var dataset = dr[1];
    if (typeof dataset !== 'undefined') {
      response.writeHead(200, { 'Content-Type': 'text/html' });
      response.write('viewing dataset ' + dataset);
      response.end();
    }
  } else {
    // Show the default page.
    response.writeHead(200, { 'Content-Type': 'text/html' });
    response.write('hello world');
    response.end();
  }

});

server.listen(8001);
