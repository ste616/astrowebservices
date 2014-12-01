require( [ "dojo/dom-attr", "dojo/on", "dojo/dom-geometry", "dojo/dom", "dojo/json" ],
  function(domAttr, on, domGeom, dom, JSON) {
    var socket = io('http://astrowebservices.com:8001');
    
    var imageTrans;
    var imageData = {
      'coords': [],
      'spectra': []
    };
    var chart = null;
    
    google.load('visualisation', '1', { 'packages': [ 'corechart' ] });

    socket.on('dataset', function(data) {
      domAttr.set('dataset-name', 'innerHTML', data['dataset']);
      domAttr.set('dataset-image', 'src', data['image']);
      imageTrans = data['size'];
      for (var i = 0; i < imageTrans['real'][0]; i++) {
	imageData['coords'].push([]);
	imageData['spectra'].push([]);
	for (var j = 0; j < imageTrans['real'][1]; j++) {
	  imageData['coords'][i].push([null, null]);
	  imageData['spectra'][i].push(null);
	}
      }
    });

    var plotSpectrum = function(x, y) {
      if (imageData['spectra'][x][y] === null) {
	return;
      }
      var dstring = window.atob(imageData['spectra'][x][y]);
      var spectrumData = JSON.parse(dstring, true);
      var plotData = [ ['Velocity', 'Amplitude' ] ];
      for (var i = 0; i < spectrumData['vel'].length; i++) {
	plotData.push([ parseFloat(spectrumData['vel'][i]),
			parseFloat(spectrumData['amp'][i]) ]);
      }
      var chartData = google.visualization.arrayToDataTable(plotData);
      if (chart === null) {
	chart = new google.visualization.LineChart(dom.byId('spectrum-holder'));
	chart.draw(chartData);
      } else {
	chart.draw(chartData);
      }
    };
    
    socket.on('position-info', function(data) {
      imageData['coords'][data['position']['x']][data['position']['y']] = data['position']['coord'];
      domAttr.set('x-pix', 'innerHTML', data['position']['x']);
      domAttr.set('y-pix', 'innerHTML', data['position']['y']);
      domAttr.set('ra-pos', 'innerHTML', data['position']['coord'][0]);
      domAttr.set('dec-pos', 'innerHTML', data['position']['coord'][1]);
      imageData['spectra'][data['position']['x']][data['position']['y']] =
	data['spectrum'];
      plotSpectrum(data['position']['x'], data['position']['y']);
    });
    
    var imgPos = null;
    on(dom.byId('dataset-image'), 'mousemove', function(e) {
      if (imgPos === null) {
	imgPos = domGeom.position(e.target);
	imageTrans['bottom-left'] = [ imageTrans['display-x'][0],
				      imageTrans['display-y'][0] ];
	imageTrans['top-right'] = [ imageTrans['display-x'][1],
				    imageTrans['display-y'][1] ];
	imageTrans['display-width'] = Math.abs(imageTrans['display-x'][1] - imageTrans['display-x'][0]);
	imageTrans['display-height'] = Math.abs(imageTrans['display-y'][1] - imageTrans['display-y'][0]);
      }
      var xoff = e.offsetX - imageTrans['bottom-left'][0];
      var yoff = imageTrans['bottom-left'][1] - e.offsetY;
      if (xoff >= 0 && xoff <= imageTrans['display-width'] &&
	  yoff >= 0 && yoff <= imageTrans['display-height']) {
	var px = xoff * (imageTrans['real'][0] / imageTrans['display-width']);
	var py = yoff * (imageTrans['real'][1] / imageTrans['display-height']);
	var rpx = Math.floor(px);
	var rpy = Math.floor(py);
	if (imageData['coords'][rpx][rpy][0] !== null) {
	  domAttr.set('ra-pos', 'innerHTML', imageData['coords'][rpx][rpy][0]);
	  domAttr.set('dec-pos', 'innerHTML', imageData['coords'][rpx][rpy][1]);
	} else {
	  socket.emit('position-request', { 'pix': [ rpx, rpy ] });
	}
      }
      
    });
});

