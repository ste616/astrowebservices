require( [ "dojo/dom", "dojo/query", "dojo/dom-attr", "dojo/dom-class", "dojo/dom-construct",
	   "dojo/on",
	   "dojo/NodeList-dom" ],
	 function(dom, query, domAttr, domClass, domConstruct, on) {
	   
	   // Add some classes to the cells of the table.
	   var i;
	   var maxspace = 0;
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
	       maxspace = (j > maxspace) ? j : maxspace;
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
	   var mouseDown = false;

	   var highlightArea = function() {
	     // Find the corners.
	     var minant = (highlightStart['antenna'] < highlightStop['antenna'])
	    ? highlightStart['antenna'] : highlightStop['antenna'];
	     
	     var maxant = (highlightStart['antenna'] > highlightStop['antenna'])
	    ? highlightStart['antenna'] : highlightStop['antenna'];
	    
	     var minbox = (highlightStart['box'] < highlightStop['box'])
	    ? highlightStart['box'] : highlightStop['box'];

	     var maxbox = (highlightStart['box'] > highlightStop['box'])
	    ? highlightStart['box'] : highlightStop['box'];

	     var a, s;
	     for (a = 1; a <= 6; a++) {
	       for (s = 0; s <= maxspace; s++) {
		 var cfind = ".space-over" + s;
		 var afind = "ca0" + a + "-row-over";
		 console.log(cfind);
		 console.log(afind);
		 query(cfind, "ca0" + afind).forEach(function(node) {
		   domClass.remove('highlighted');
		 });
	       }
	     }

	     for (a = minant; a <= maxant; a++) {
	       for (s = minbox; s <= maxbox; s++) {
		 query(".space-over" + s, dom.byId("ca0" + a + "-row-over")).forEach(function(node) {
		   domClass.add('highlighted');
		 });
	       }
	     }
	     
	   };

	   // Make some event responders.
	   on(dom.byId('array-table-over'), 'mousedown', function(e) {
	     // Set the start element.
	     var t = /ca0(.)-row-over/.exec(domAttr.get(e.target.parentNode, 'id'));
	     highlightStart['antenna'] = t[1];
	     t = /space-over(.)/.exec(domAttr.get(e.target, 'class'));
	     highlightStart['box'] = t[1];

	     // Indicate that the mouse button is down now.
	     mouseDown = true;

	     // Highlight this cell.
	     domClass.add(e.target, 'highlighted');
	   });
	   
	   on(dom.byId('array-table-over'), 'mouseup', function(e) {
	     // Set the end element.
	     var t = /ca0(.)-row-over/.exec(domAttr.get(e.target.parentNode, 'id'));
	     highlightStop['antenna'] = t[1];
	     t = /space-over(.)/.exec(domAttr.get(e.target, 'class'));
	     highlightStop['box'] = t[1];

	     // Indicate that the mouse button is no longer down.
	     mouseDown = false;

	     // Highlight this cell.
	     domClass.add(e.target, 'highlighted');
	   });

	   on(dom.byId('array-table-over'), 'mouseover', function(e) {
	     // Don't do anything if the mouse button is not down.
	     if (!mouseDown) {
	       return;
	     }

	     var t = /ca0(.)-row-over/.exec(domAttr.get(e.target.parentNode, 'id'));
	     highlightStop['antenna'] = t[1];
	     t = /space-over(.)/.exec(domAttr.get(e.target, 'class'));
	     highlightStop['box'] = t[1];

	     // Highlight all the cells.
	     highlightArea();
	   });
	 });
