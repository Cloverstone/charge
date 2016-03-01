var fs = require('fs');
// var config = {};
// if(typeof process.argv[2] !== 'undefined') {
// 	config = JSON.parse(fs.readFileSync(process.argv[2] + 'config.json', 'utf8')); 
// }


// var config = JSON.parse(fs.readFileSync('config.json', 'utf8')); 
var target_dir = process.argv[2] || './public';

/**
 * Static HTTP Server
 *
 * Create a static file server instance to serve files
 * and folder in the './public' folder
 */

// modules
var static = require( 'node-static' ),
    port = 8888,
    http = require( 'http' );

// config
var file = new static.Server( target_dir, {
    cache: 3600,
    gzip: true
} );

// serve
http.createServer( function ( request, response ) {
  request.addListener( 'end', function () {
    file.serve( request, response );
  } ).resume();
} ).listen( port );