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

	   // Find the minimum and maximum of two values.
	   var minab = function(a, b) {
	     if (a < b) {
	       return a;
	     } else {
	       return b;
	     }
	   };
	   var maxab = function(a, b) {
	     if (a > b) {
	       return a;
	     } else {
	       return b;
	     }
	   };

	   // Select a box region and apply or remove a class to it.
	   var applyClass = function(mina, maxa, minb, maxb, add) {
	     var a, s, cfind, afind;
	     for (a = mina; a <= maxa; a++) {
	       for (s = minb; s <= maxb; s++) {
		 cfind = ".space-over" + s;
		 afind = "ca0" + a + "-row-over";
		 if (add) {
		   query(cfind, afind).addClass('highlighted');
		 } else {
		   query(cfind, afind).removeClass('highlighted');
		 }
	       }
	     }
	     
	   };

	   var highlightArea = function() {
	     // Find the corners.
	     var minant = minab(highlightStart['antenna'], highlightStop['antenna']);
	     var maxant = maxab(highlightStart['antenna'], highlightStop['antenna']);
	    
	     var minbox = minab(highlightStart['box'], highlightStop['box']);
	     var maxbox = maxab(highlightStart['box'], highlightStop['box']);

	     // Apply the classes to our regions.
	     applyClass(1, 6, 0, maxspace, false);
	     applyClass(minant, maxant, minbox, maxbox, true);	     
	   };

	   // Determine things from the event target.
	   var parseTarget = function(e) {
	     var t = /ca0(.)-row-over/.exec(domAttr.get(e.target.parentNode, 'id'));
	     var u = /space-over(.*)$/.exec(domAttr.get(e.target, 'class'));

	     return { 'antenna': parseInt(t[1]),
		      'box': parseInt(u[1]) };
	   };

	   // Make some event responders.
	   on(dom.byId('array-table-over'), 'mousedown', function(e) {
	     // Set the start element.
	     highlightStart = parseTarget(e);

	     // Indicate that the mouse button is down now.
	     mouseDown = true;

	     // Highlight this cell.
	     domClass.add(e.target, 'highlighted');
	   });
	   
	   on(dom.byId('array-table-over'), 'mouseup', function(e) {
	     // Set the end element.
	     highlightStop = parseTarget(e);

	     // Indicate that the mouse button is no longer down.
	     mouseDown = false;
	   });

	   on(dom.byId('array-table-over'), 'mouseover', function(e) {
	     // Don't do anything if the mouse button is not down.
	     if (!mouseDown) {
	       return;
	     }

	     highlightStop = parseTarget(e);

	     // Highlight all the cells.
	     highlightArea();
	   });
	 });
