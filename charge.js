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

var partials = fs.readdirSync('partials');
for(var i in partials) {
	var filecontent = fs.readFileSync('partials/'+partials[i], 'utf8');
	partialViews[partials[i].split('.mustache')[0]] = filecontent;
}

fs.readdir('pages', function(err, files){
	files.forEach(function(file) {
		fs.readFile('pages/'+file, 'utf8', function (err, view) {
		  if (err) {
		    return console.log(err);
		  }
		  fs.writeFile('public/'+file.split('.mustache')[0]+'.html', Mustache.render(view, globalData, partialViews), function (err) {
		  	if (err) return console.log(err);
			});
		});
	})
})
