
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , server;

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(require('less-middleware')({ src: __dirname + '/public' }));

  app.use('/public', express.static(path.join(__dirname, 'public')));
  app.use('/lib', express.static(path.join(__dirname, 'lib')));

  // Vendor
  app.use('/vendor/jquery/', express.static(path.join(__dirname, 'node_modules/jquery-browser/lib/')));
  app.use('/vendor/underscore/', express.static(path.join(__dirname, 'node_modules/underscore/')));
  app.use('/vendor/socket.io/', express.static(path.join(__dirname, 'node_modules/socket.io-client/dist/')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

// Routes
app.get('/', routes.index);
app.get(/^\/scorekeeper\/([1-9]\d*)\/?/, require('./routes/scorekeeper').index);

// Web server
server = http.createServer(app);

// socket.io scorekeeper router
require('./lib/router/scorekeeper-router').listen(server);

server.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});
