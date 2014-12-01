// This is the node.js server for AstroWebServices.com.

var app = require('http').createServer(handler);
var url = require('url');
var fs = require('fs');
var io = require('socket.io')(app);

app.listen(8001);

var allClients = [];

var datasetHandler = function(dataset) {
  var r = {};
  var ourSocket = null;

  var fileObj;

  var readFile = function() {
    var dname = 'data/' + dataset + '/description.json';
    console.log('reading ' + dname);
    fs.readFile(dname, 'utf8', function(err, data) {
      if (err) {
	console.log(err);
	// Dataset doesn't exist or something is wrong.
	ourSocket.emit('dataset', { 'dataset': 'UNKNOWN',
				    'image': null, 'size': null });
	ourSocket.disconnect();
	return;
      }
      fileObj = JSON.parse(data);
      ourSocket.emit('dataset', { 'dataset': fileObj['name'],
			       'image': '/images/' + dataset + '/' + fileObj['image']['file'],
			       'size': fileObj['image']['size'] } );
    });
  };

  var positionRequest = function(idata) {
    var n = './data/' + dataset + '/positions/pos_' + idata['pix'][0] + '_' + idata['pix'][1];
    var d = './data/' + dataset + '/spectra/spectrum_' + idata['pix'][0] + '_' + idata['pix'][1];
    fs.readFile(n, 'utf8', function(err, data) {
      if (err) {
	return;
      }
      var posObj = JSON.parse(data);
      fs.readFile(d, 'utf8', function(derr, ddata) {
	if (derr) {
	  return;
	}
	var dataBuf = new Buffer(ddata).toString('base64');
	
	ourSocket.emit('position-info', { 'position': posObj,
					  'spectrum': dataBuf });
      });
    });
  };
  
  r['connection'] = function(socket) {
    if (dataset == 'null') {
      return;
    }
    if (ourSocket === null) {
      ourSocket = socket;
      console.log('making new connection handler with socket ' + ourSocket);
      readFile();
      ourSocket.on('position-request', positionRequest);
    } else {
      return;
    }
  };


  return r;
};

function handler (request, response) {
  console.log('Connection.');
  var path = url.parse(request.url).pathname;

  if (/^\/spectraViewer\//.test(path)) {
    // User wants the spectra viewer.
    var dr = /^\/spectraViewer\/(.*)\/*$/.exec(path);
    var dataset = dr[1];
    var c = datasetHandler(dataset);
    io.on('connection', c['connection']);
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
