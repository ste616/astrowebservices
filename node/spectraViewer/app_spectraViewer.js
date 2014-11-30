// This is the node.js server for AstroWebServices.com.

var app = require('http').createServer(handler);
var url = require('url');
var fs = require('fs');
var io = require('socket.io')(app);

app.listen(8001);

function handler (request, response) {
  console.log('Connection.');
  var path = url.parse(request.url).pathname;

  if (/^\/spectraViewer\//.test(path)) {
    // User wants the spectra viewer.
    var dr = /^\/spectraViewer\/(.*)\/*$/.exec(path);
    var dataset = dr[1];
    var fileObj;
    io.on('connection', function(socket) {
      console.log('emitting dataset');
      // Read the configuration file.
      fs.readFile('data/' + dr[1] + '/description.json', 'utf8', function(err, data) {
	if (err) throw err;
	fileObj = JSON.parse(data);
	socket.emit('dataset', { 'dataset': fileObj['name'],
				 'image': '/images/' + dataset + '/' + fileObj['image']['file'] } );
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
    var ext = path.extname(path);
    var contentType = 'image/' + ext;
    response.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream('data/' + dr[1], 'utf-8').pipe(response);
  } else {
    // Show the default page.
    response.writeHead(200, { 'Content-Type': 'text/html' });
    response.write('hello world');
    response.end();
  }

};
