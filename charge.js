fs = require('fs');
Mustache = require('Mustache');
var filecontent = fs.readFileSync('data/global.json', 'utf8');
globalData = JSON.parse(filecontent);
partialViews = {};
var files = fs.readdirSync('data');
for(var i in files) {
	var filecontent = fs.readFileSync('data/'+files[i], 'utf8');
	globalData[files[i].split('.json')[0]] = JSON.parse(filecontent);
}

var partials = fs.readdirSync('templates/partials');
for(var i in partials) {
	var filecontent = fs.readFileSync('templates/partials/'+partials[i], 'utf8');
	partialViews[partials[i].split('.mustache')[0]] = filecontent;
}
var layout = fs.readFileSync('templates/layouts/default.mustache', 'utf8'); 
fs.readdir('templates', function(err, files){
	files.forEach(function(file) {
		fs.readFile('templates/'+file, 'utf8', function (err, view) {
		  if (err) {
		  	if (err.code !== 'EISDIR') {
		  		return console.log(err.errno);
		  	}else{
		  		return;
		  	}
		  }
		  partialViews.content = view;
		  fs.writeFile('public/'+file.split('.mustache')[0]+'.html', Mustache.render(layout, globalData, partialViews), function (err) {
		  	if (err) return console.log(err);
			});
		});
	})
})
