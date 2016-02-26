var marked = require('marked');
var http = require('http');
var Promise = require('bluebird');
var _ = require('lodash');
var fs = Promise.promisifyAll(require('fs'));
var Mustache = require('Mustache');

var PromiseRequest = Promise.method(function(options) {
    return new Promise(function(resolve, reject) { 
        var request = http.request(options, function(response) {
            // Bundle the result
            var result = {
                'httpVersion': response.httpVersion,
                'httpStatusCode': response.statusCode,
                'headers': response.headers,
                'body': '',
                'trailers': response.trailers,
            };

            // Build the body
            response.on('data', function(chunk) {
                result.body += chunk;
            });

            // Resolve the promise when the response ends
            response.on('end', function() {
                resolve(result);
            });
        });

        // Handle errors
        request.on('error', function(error) {
            console.log('Problem with request:', error.message);
            reject(error);
        });

        // Must always call .end() even if there is no data being written to the request body
        request.end();
    });
});





var config = JSON.parse(fs.readFileSync('config.json', 'utf8')); 

var data_dir = config.data_dir || './_site/data';
var target_dir = config.target_dir || './public';
var template_dir = config.template_dir || './_site/templates';
var layouts_dir = config.layouts_dir || template_dir + '/layouts/';
var partials_dir = config.partials_dir || template_dir + '/partials/';
var ext = '.mustache';



var filecontent = fs.readFileSync(data_dir + '/global.json', 'utf8');
globalData = JSON.parse(filecontent);
partialViews = {};
layoutViews = {};
var files = fs.readdirSync(data_dir);
for(var i in files) {
    var filecontent = fs.readFileSync(data_dir + '/'+files[i], 'utf8');
    globalData[files[i].split('.json')[0]] = JSON.parse(filecontent);
}

var partials = fs.readdirSync(partials_dir);
for(var i in partials) {
 partialViews[partials[i].split(ext)[0]] = fs.readFileSync(partials_dir+partials[i], 'utf8');
}

var layouts = fs.readdirSync(layouts_dir);
for(var i in layouts) {
 layoutViews[layouts[i].split(ext)[0]] = fs.readFileSync(layouts_dir+layouts[i], 'utf8');
}

fs.readdirAsync(template_dir).map(function (file) {

    var ref = file.split(ext)[0];
    var view = '';
    return fs.readFileAsync(template_dir + "/" + file, "utf8").then(function(content){
    	view = content;
    	if(typeof globalData[ref].fetch !== 'undefined') {
				return PromiseRequest(_.extend({
				    method: 'GET',
				    host: 'cberry.io',
				    port: 80,
				    path: '/d/563175329c58748ec57f5730',
				},globalData[ref].fetch)).then(function(value) {
				    console.log('data'+ref);
				});
    	}

    })
    .then(function(){
    	// var view = gview;
    	console.log(ref);
      fs.writeFileSync(target_dir + '/' + ref + '.html', Mustache.render(
      	layoutViews[ globalData[ref].layout || 'default'], 
      	_.extend({page: globalData[ref]}, globalData), 
      	_.extend({content: marked(view.split('{{>').join('{{\\>'))}, partialViews)
      	
      ));
    }).catch(function(err){
      if (err.code !== 'EISDIR') {
        console.log(err.errno);
      }
    });
}).then(function() {
	console.log('Completed! - your site is located at ' + target_dir);
})




// var myRequest = PromiseRequest({
//     method: 'GET',
//     host: 'cberry.io',
//     port: 80,
//     path: '/d/563175329c58748ec57f5730',
// }).then(function(value) {
//     console.log(value.body);
// });

