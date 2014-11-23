require( [ "dojo/dom", "dojo/query", "dojo/dom-attr", "dojo/dom-class", "dojo/dom-construct",
	   "dojo/on",
	   "dojo/NodeList-dom" ],
	 function(dom, query, domAttr, domClass, domConstruct, on) {
	   
	   // Add some classes to the cells of the table.
	   var i;
	   for (i = 1; i <= 6; i++) {
	     var tr = dom.byId("ca0" + i + "-row-under");
	     var j = 0;
	     query("td", tr).forEach(function(node) {
	       domClass.add(node, "space-under" + j);
	       if (j === 5 || j === 10 || j === 11) {
		 domClass.add(node, "breaktime");
	       }
	       j++;
	     });

	     tr = dom.byId("ca0" + i + "-row-over");
	     j = 0;
	     query("td", tr).forEach(function(node) {
	       domClass.add(node, "space-over" + j);
	       j++;
	     });
	     
	   }
	   
	   // Highlight an area.
	   var highlightStart = {
	     'antenna': null,
	     'box': null
	   };
	   var highlightStop = {
	     'antenna': null,
	     'box': null
	   };

	   var highlightArea = function() {
	     
	   };

	   // Make some event responders.
	   on(dom.byId('array-table-over'), 'mousedown', function(e) {
	     console.log(domAttr.get(e.target, 'class'));
	     console.log('mouse button pressed');
	     console.log(e.target);
	   });
	   
	   on(dom.byId('array-table-over'), 'mouseup', function(e) {
	     console.log(domAttr.get(e.target, 'class'));
	     console.log('mouse button released');
	     console.log(e.target);
	   });
	 });
