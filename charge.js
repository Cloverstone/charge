var fs = require('fs');
var marked = require('marked');

var config = JSON.parse(fs.readFileSync('config.json', 'utf8')); 

var data_dir = config.data_dir || './_site/data';
var target_dir = config.target_dir || './public';
var template_dir = config.template_dir || './_site/templates';
var layouts_dir = config.layouts_dir || template_dir + '/layouts/';
var partials_dir = config.partials_dir || template_dir + '/partials/';
var ext = '.mustache';

Mustache = require('Mustache');
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
		  globalData.page = globalData[file.split(ext)[0]];

		  if(globalData.page.widgets){
		  	// globalData.page.sections = [];
		  	// globalData.page.widgets.each(function(section){
					// globalData.page.sections.push(section[0].content)
		  	// })
		  }
			partialViews.content = marked(view.split('{{>').join('{{\\>'));

		  fs.writeFileSync(target_dir + '/' + file.split(ext)[0] + '.html', Mustache.render(layoutViews[ globalData.page.layout || 'default'], globalData, partialViews));
		  delete partialViews.content;
		});
	})
	console.log('Completed! - your site is located at ' + target_dir);
})
