require( [ "dojo/dom-attr", "dojo/on", "dojo/dom-geometry", "dojo/dom" ],
	 function(domAttr, on, domGeom, dom) {
	   var socket = io('http://astrowebservices.com:8001');
	   
	   var imageTrans;

	   socket.on('dataset', function(data) {
	     domAttr.set('dataset-name', 'innerHTML', data['dataset']);
	     domAttr.set('dataset-image', 'src', data['image']);
	     imageTrans = data['size'];
	   });

	   var imgPos = null;
	   on(dom.byId('dataset-image'), 'mousemove', function(e) {
	     if (imgPos === null) {
	       ep = domGeom.position(e.target);
	     }
	     console.log(e);
	   });
});

