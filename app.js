
/**
 * Module dependencies.
 */

// var render = require('./lib/render');
// var logger = require('koa-logger');
var route = require('koa-route');
var parse = require('co-body');
var handlebars = require("koa-handlebars");
var serve = require('koa-static-folder');
var koa = require('koa');
var app = koa();

var fs = require('fs');
// "database"

var posts = [];
var config = {};
// middleware

// app.use(logger());
app.use(serve('./public'));
app.use(handlebars({
  defaultLayout: "index"
}));
app.use(function *(next){
  if(typeof process.argv[2] !== 'undefined') {
    config = JSON.parse(fs.readFileSync(process.argv[2] + 'config.json', 'utf8')); 
  }
  yield next;
})
// route middleware

app.use(route.get('/', list));
app.use(route.get('/post/new', add));
app.use(route.get('/data/:id', show));
app.use(route.post('/post', create));
app.use(route.post('/data/:id', update));

// route definitions


/**
 * Post listing.
 */

function *list() {
  this.body = yield function *() {
    return fs.readdirSync(config.data_dir || './_site/data');
  };
}

/**
 * Show creation form.
 */

function *add() {
  this.body = yield render('new');
}

/**
 * Show post :id.
 */

function *show(id) {

  // var post = posts[id];
  // if (!post) this.throw(404, 'invalid post id');
  // this.body = yield render('show', { post: post });

  this.body = yield function *() {
    return JSON.parse(fs.readFileSync(config.data_dir + '/' + id + '.json', 'utf8'));
  };
}

/**
 * Show post :id.
 */

function *update(id) {

  var data = yield parse(this);
  fs.writeFileSync(config.data_dir + '/' + id + '.json', JSON.stringify(data));
  this.body = yield function *() {
    return true;//JSON.parse(fs.readFileSync(config.data_dir + '/' + id + '.json', 'utf8'));
  };
}


/**
 * Create a post.
 */

function *create() {
  var post = yield parse(this);
  var id = posts.push(post) - 1;
  post.created_at = new Date;
  post.id = id;
  this.redirect('/');
}

// listen

app.listen(3000);
console.log('listening on port 3000');