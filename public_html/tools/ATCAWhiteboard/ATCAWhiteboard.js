require( [ "dojo/dom", "dojo/query", "dojo/dom-attr", "dojo/dom-class", "dojo/dom-construct",
	   "dojo/on",
	   "dojo/NodeList-dom" ],
	 function(dom, query, domAttr, domClass, domConstruct, on) {
	     
	     // Add some classes to the cells of the table.
	     var i;
	     for (i = 1; i <= 6; i++) {
		 var tr = dom.byId("ca0" + i + "_row");
		 var j = 0;
		 query("td", tr).forEach(function(node) {
		     domClass.add(node, "space" + j);
		     if (j === 5 || j === 10 || j === 11) {
			 domClass.add(node, "breaktime");
		     }
		     j++;
		 });
		     
	     }

	     // Make some event responders.
	     on(dom.byId('arrayTable'), 'mousedown', function(e) {
		 console.log('mouse button pressed');
		 console.log(e.target);
	     });

	     on(dom.byId('arrayTable'), 'mouseup', function(e) {
		 console.log('mouse button released');
		 console.log(e.target);
	     });
	 });