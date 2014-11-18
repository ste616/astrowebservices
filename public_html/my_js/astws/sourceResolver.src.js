// This is astws/sourceResolver
// @author Jamie Stevens, astrowebservices.com
define([ "dojo/_base/lang", "dojo/_base/Deferred", "dojo/_base/xhr" ],
       function(lang, Deferred, xhr) {
	 
	 /*
	  * This routine queries for source location given a name.
	  */
	 var _r = {}; // The object that we will return.
	 
	 // Our local storage.
	 
	 // A cache of previously resolved sources.
	 var _sourcesResolved = {};
	 
	 // Configuration variables.
	 var _moduleConfig = {
	   // The location of the script that does the name resolution.
	   'resolverScript': '/cgi-bin/sourceResolver.pl'
	 };
	 
	 var _public_setConfig = function(o) {
	   if (typeof o['resolverScript'] !== 'undefined') {
	     _moduleConfig['resolverScript'] = o['resolverScript'];
	   }
	   return _r; // Allow for method chaining.
	 };
	 /*
	  * Configure required parameters.
	  * 
	  * @param {object} o An object containing configuration variables.
	  * @return {sourceResolver} The same source resolver.
	  */
	 _r['setConfig'] = _public_setConfig;
	 
	 var _public_resolveByName = function(name) {
	   // Check that we get a name to resolve.
	   if (typeof name === 'undefined' ||
	       name === '') {
	     return null;
	   }
	   
	   // Make a promise that will be resolved when the resolution
	   // script returns.
	   var postDeferred = xhr.post({
	     'url': _moduleConfig['resolverScript'],
	     'sync': false,
	     'content': {
	       'name': name
	     },
	     'handleAs': 'json',
	     'failOK': true
	   });
	   
	   // Call the data and error handlers.
	   return postDeferred.then(_private_resolveSuccess,
				    _private_resolveError);
	 };
	 /*
	  * Resolve a source given its name.
	  *
	  * @param {string} name The name of the object to resolve.
	  * @return {Deferred} A promise to resolve the object.
	  */
	 _r['resolveByName'] = _public_resolveByName;
	 
	 /*
	  * Private routine.
	  * Called when name resolution has completed successfully.
	  */
	 var _private_resolveSuccess = function(d, i) {
	   // Check that we don't get an error.
	   if (typeof d['error'] !== 'undefined') {
	     // Name resolution failed, so we return null.
	     return null;
	   } else if (typeof d['position'] !== 'undefined') {
	     // We got a position.
	     return d;
	   }
	 };
	 
	 /*
	  * Private routine.
	  * Called when name resolution fails.
	  */
	 var _private_resolveError = function(e, i) {
	   console.log('Name resolution failed in sourceResolver.js');
	   console.log(e);
	   return undefined;
	 };
	 
	 return _r;

       });
