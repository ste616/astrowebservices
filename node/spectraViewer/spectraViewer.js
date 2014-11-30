require( [ "dojo/dom-attr" ],
	 function(domAttr) {
	   var socket = io('http://astrowebservices.com:8001');
	   
	   socket.on('dataset', function(data) {
	     domAttr.set('dataset-name', 'innerHTML', data['dataset']);
	   });
});

