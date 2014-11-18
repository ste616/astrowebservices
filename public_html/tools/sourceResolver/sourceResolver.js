// This is the Javascript required to operate sourceResolver.html.
require( [ "astws/sourceResolver", "dojo/dom", "dojo/dom-construct", "dojo/dom-attr",
	   "dojo/on", "dojo/keys", "dojo/dom-class" ],
	 function(sourceResolver, dom, domConstruct, domAttr, on, keys, domClass) {

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
		     domAttr.set('position-right-ascension', 'innerHTML',
				 res['position']['ra']);
		     domAttr.set('position-declination', 'innerHTML',
				 res['position']['dec']);
		     domAttr.set('position-epoch', 'innerHTML',
				 res['position']['epoch']);
		     domClass.add('resolve-error', 'hidden');
		     domClass.remove('position-info', 'hidden');
		   } else {
		     domAttr.set('resolve-error', 'innerHTML',
				 'Could not resolve name ' + s);
		     domClass.remove('resolve-error', 'hidden');
		     domClass.add('position-info', 'hidden');
		   }
		 });
	     }
	   });
	   
	 });
