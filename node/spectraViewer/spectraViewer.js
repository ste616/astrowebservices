require( [ "dojo/dom-attr", "dojo/on", "dojo/dom-geometry", "dojo/dom" ],
	 function(domAttr, on, domGeom, dom) {
	   var socket = io('http://astrowebservices.com:8001');
	   
	   var imageTrans;

	   socket.on('dataset', function(data) {
	     domAttr.set('dataset-name', 'innerHTML', data['dataset']);
	     domAttr.set('dataset-image', 'src', data['image']);
	     imageTrans = data['size'];
	   });

	   on(dom.byId('dataset-image'), 'mouseover', function(e) {
	     var ep = domGeom.position(e);
	     console.log(e);
	   });
});

