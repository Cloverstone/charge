fs = require('fs');

var template_dir = './_templates';
var data_dir = './_data';
var target_dir = './public';

Mustache = require('Mustache');
var filecontent = fs.readFileSync(data_dir + '/global.json', 'utf8');
globalData = JSON.parse(filecontent);
partialViews = {};

var files = fs.readdirSync(data_dir);
for(var i in files) {
	var filecontent = fs.readFileSync(data_dir + '/'+files[i], 'utf8');
	globalData[files[i].split('.json')[0]] = JSON.parse(filecontent);
}

var partials = fs.readdirSync(template_dir + '/partials');
for(var i in partials) {
	var filecontent = fs.readFileSync(template_dir + '/partials/'+partials[i], 'utf8');
	partialViews[partials[i].split('.mustache')[0]] = filecontent;
}

var layout = fs.readFileSync(template_dir + '/layouts/default.mustache', 'utf8'); 

fs.readdir(template_dir, function(err, files){
	files.forEach(function(file) {
		fs.readFile(template_dir + '/' + file, 'utf8', function (err, view) {
		  if (err) {
		  	if (err.code !== 'EISDIR') {
		  		return console.log(err.errno);
		  	}else{
		  		return;
		  	}
		  }
		  partialViews.content = view;
		  fs.writeFile(target_dir + '/' + file.split('.mustache')[0] + '.html', Mustache.render(layout, globalData, partialViews), function (err) {
		  	if (err) return console.log(err);
			});
		});
	})
})
