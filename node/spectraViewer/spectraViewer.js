require( [ "dojo/dom-attr", "dojo/on", "dojo/dom-geometry", "dojo/dom" ],
	 function(domAttr, on, domGeom, dom) {
	   var socket = io('http://astrowebservices.com:8001');
	   
	   var imageTrans;
	   var imageData = {
	     'coords': []
	   };

	   socket.on('dataset', function(data) {
	     console.log(data);
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

	   var imgPos = null;
	   on(dom.byId('dataset-image'), 'mousemove', function(e) {
	     if (imgPos === null) {
	       imgPos = domGeom.position(e.target);
	       imageTrans['top-left'] = [ imageTrans['display-x'][0],
					  (imgPos['height'] - imageTrans['display-y'][1]) ];
	       imageTrans['bottom-right'] = [ imageTrans['display-x'][1],
					      (imgPos['height'] - imageTrans['display-y'][0]) ];
	       imageTrans['display-width'] = imageTrans['display-x'][1] - imageTrans['display-x'][0];
	       imageTrans['display-height'] = imageTrans['display-y'][1] - imageTrans['display-y'][0];	       
	     }
	     var xoff = e.offsetX - imageTrans['top-left'][0];
	     var yoff = e.offsetY - imageTrans['top-left'][1];
	     console.log(xoff + ' ' + yoff);
	     if (xoff >= 0 && xoff <= imageTrans['display-width'] &&
		 yoff >= 0 && yoff <= imageTrans['display-height']) {
	       var px = xoff * (imageTrans['display-width'] / imageTrans['real'][0]);
	       var py = yoff * (imageTrans['display-height'] / imageTrans['real'][1]);
	       domAttr.set('x-pix', 'innerHTML', px);
	       domAttr.set('y-pix', 'innerHTML', py);
	     }

	   });
});

