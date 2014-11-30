// This is the node.js server for AstroWebServices.com.

var app = require('http').createServer(handler);
var url = require('url');
var fs = require('fs');
var io = require('socket.io')(app);

app.listen(8001);

var ioFunctions = {
  'connection': function() {}
};

function handler (request, response) {
  console.log('Connection.');
  var path = url.parse(request.url).pathname;

  if (/^\/spectraViewer\//.test(path)) {
    // User wants the spectra viewer.
    var dr = /^\/spectraViewer\/(.*)\/*$/.exec(path);
    var dataset = dr[1];
    ioFunctions['connection'] = function(socket) {
      socket.emit('dataset', { 'dataset': dr[1] } );
    };
    if (typeof dataset !== 'undefined') {
      fs.readFile(__dirname + '/spectraViewer/spectraViewer.html', function(error, data) {
	if (error) {
	  response.writeHead(404);
	  response.write('Unable to load spectra viewer.');
	  response.end();
	} else {
	  response.writeHead(200, { 'Content-Type': 'text/html' });
	  response.write(data, "utf8");
	  response.end();
	}
      });
    }
  } else if (/^\/scripts\//.test(path)) {
    // Return the user a JS.
    var dr = /^\/scripts\/(.*)$/.exec(path);
    console.log('requested a script ' + dr[1]);
    fs.readFile(__dirname + "/" + dr[1], function(error, data) {
      if (error) {
	response.writeHead(404);
	response.write('Unable to find script.');
	response.end();
      } else {
	response.writeHead(200, { 'Content-Type': 'application/javascript' });
	response.write(data, "utf8");
	response.end();
      }
    });
  } else {
    // Show the default page.
    response.writeHead(200, { 'Content-Type': 'text/html' });
    response.write('hello world');
    response.end();
  }

};


io.on('connection', ioFunctions['connection']);
