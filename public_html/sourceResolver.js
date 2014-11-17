// This is the Javascript required to operate sourceResolver.html.
require( [ "astws/sourceResolver", "dojo/dom", "dojo/dom-construct", "dojo/dom-attr",
	   "dojo/on", "dojo/keys" ],
	 function(sourceResolver, dom, domConstruct, domAttr, on, keys) {

	     // Configure the resolving module.
	     sourceResolver.setConfig({
		 'resolverScript': '/~ste616/cgi-bin/sourceResolver.pl'
	     });

	     // Do the name resolution when we someone puts a name in
	     // the input box.
	     on(dom.byId('source-name'), 'keydown', function(e) {
		 if (e.keyCode === keys.ENTER) {
		     // Resolve the name.
		     var s = domAttr.get('source-name', 'value');
		     sourceResolver.resolveByName(s).
			 then(function(res) {
			     if (res) {
				 var ra = domConstruct.create('p', {
				     'id': 'rightAscension',
				     'innerHTML': 'RA: ' + res['ra']
				 });
				 dom.byId('results-area').appendChild(ra);
			     } else {
				 var e = domConstruct.create('p', {
				     'id': 'errorMessage',
				     'innerHTML': 'Could not resolve name ' + s
				 });
				 dom.byId('results-area').appendChild(e);
			     }
			 });
		 }
	     });

	 });
