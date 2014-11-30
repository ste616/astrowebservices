require( [ "dojo/dom-attr", "dojo/on", "dojo/dom-geometry", "dojo/dom" ],
	 function(domAttr, on, domGeom, dom) {
	   var socket = io('http://astrowebservices.com:8001');
	   
	   var imageTrans;
	   var imageData = {
	     'coords': []
	   };

	   socket.on('dataset', function(data) {
	     domAttr.set('dataset-name', 'innerHTML', data['dataset']);
	     domAttr.set('dataset-image', 'src', data['image']);
	     imageTrans = data['size'];
	     for (var i = 0; i < imageTrans['real'][0]; i++) {
	       imageData['coords'].push([]);
	       for (var j = 0; j < imageTrans['real'][1]; j++) {
		 imageData['coords'][i].push([null, null]);
	       }
	     }
	   });

	   socket.on('position-info', function(data) {
	     imageData['coords'][data['x']][data['y']] = data['coord'];
	     domAttr.set('x-pix', 'innerHTML', px);
	     domAttr.set('y-pix', 'innerHTML', py);
	     domAttr.set('ra-pos', 'innerHTML', imageData['coords'][rpx][rpy][0]);
	     domAttr.set('dec-pos', 'innerHTML', imageData['coords'][rpx][rpy][1]);
	     
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

