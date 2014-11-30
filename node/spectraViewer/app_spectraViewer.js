// This is the node.js server for AstroWebServices.com.

var app = require('http').createServer(handler);
var url = require('url');
var fs = require('fs');
var io = require('socket.io')(app);

app.listen(8001);

var allClients = [];

var handleDataset = function(dataset, request, response) {
    var fileObj;
    io.on('connection', function(socket) {
      allClients.push(socket);

      socket.on('disconnect', function() {
	var i = allClients.indexOf(socket);
	socket.on('connection', undefined);
	socket.on('position-request', undefined);
	allClients.splice(i, 1);
      });

      console.log('emitting dataset');
      // Read the configuration file.
      var dname = 'data/' + dataset + '/description.json';
      console.log('reading ' + dname);
      fs.readFile(dname, 'utf8', function(err, data) {
	if (err) {
	  console.log(err);
	  // Dataset doesn't exist or something is wrong.
	  socket.emit('dataset', { 'dataset': 'UNKNOWN',
				   'image': null, 'size': null });
	  socket.disconnect();
	  return;
	}
	fileObj = JSON.parse(data);
	socket.emit('dataset', { 'dataset': fileObj['name'],
				 'image': '/images/' + dataset + '/' + fileObj['image']['file'],
				 'size': fileObj['image']['size'] } );
	socket.on('position-request', function(data) {
	  var n = './data/' + dataset + '/positions/pos_' + data['pix'][0] + '_' + data['pix'][1];
	  fs.readFile(n, 'utf8', function(err, data) {
	    var posObj = JSON.parse(data);
	    socket.emit('position-info', posObj);
	  });
	});
      });
    });
    if (typeof dataset !== 'undefined') {
      fs.readFile('./spectraViewer.html', function(error, data) {
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
};

function handler (request, response) {
  console.log('Connection.');
  var path = url.parse(request.url).pathname;

  if (/^\/spectraViewer\//.test(path)) {
    // User wants the spectra viewer.
    var dr = /^\/spectraViewer\/(.*)\/*$/.exec(path);
    var dataset = dr[1];
    handleDataset(dataset, request, response);
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
  } else if (/^\/images\//.test(path)) {
    var dr = /^\/images\/(.*)$/.exec(path);
    var ext = /^.*\.([^\.]*)$/.exec(path);
    var contentType = 'image/' + ext[1];
    response.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream('data/' + dr[1], 'utf-8').pipe(response);
  } else {
    // Show the default page.
    response.writeHead(200, { 'Content-Type': 'text/html' });
    response.write('hello world');
    response.end();
  }

};
