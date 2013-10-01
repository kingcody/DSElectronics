/*jslint node: true */
'use strict';
// utils
var fs = require('fs'),
    https = require('https');

// import SSL keys
var sslConfig = {
  key: fs.readFileSync('server/ssl/https.key'),
  cert: fs.readFileSync('server/ssl/https.crt'),
  ca: fs.readFileSync('server/ssl/ca.crt'),
  passphrase: 'fixt16'
};

var express = require('express'),
    app = express(),
    passport = require('passport'),
    redisConnection = require('connect-redis')(express),
    server = https.createServer(sslConfig, app),
    io = require('socket.io').listen(server),
    sessionSocketIO = require('session.socket.io'),
    // local modules
    routes = require('./routes'),
    socketServer = require('./socketIO'),
    auth = require('./auth');

app.use(express.bodyParser());

// load jade support
app.set('views', __dirname + '/apiViews');
app.set('view engine', 'jade');

// load express session support
var sessionStore = new redisConnection({
      host: 'localhost',
      port: 6379,
      db: 0
    }),
    cookieParser = express.cookieParser(),
    cookieSession = express.cookieSession({ 
      secret: "torp torp mf's!",
      key: 'dselec.sess',
      store: sessionStore
    });
app.use(cookieParser);
app.use(cookieSession);

// add csrf support
app.use(express.csrf({value: auth.csrf}));
app.use(function(req, res, next) {
   res.cookie('XSRF-TOKEN', req.csrfToken());
   next();
});

// setup passport authentication
app.use(passport.initialize());
app.use(passport.session());

passport.use(auth.localStrategy);
passport.serializeUser(auth.serializeUser);
passport.deserializeUser(auth.deserializeUser);

// add session login|logout routes
app.post('/session/login', auth.login);
app.get('/session/logout', auth.logout);

// add session user request route
app.get('/session/user', auth.ensureAuthenticated, function(req, res, next) {
  return res.json(req.session.user);
});

// add express api routes
app.get('/api/awesomeThings', function(req, res, next) {
  return routes.awesomeThings(req, res, next);
});
app.get('/apiViews/*', auth.ensureAuthenticated, function(req, res, next) {
  return routes.apiRouter(req, res, next);
});

// respond with 404 if not authenticated or no valid request match was made
app.use(function (req, res) {
    res.json({'ok': false, 'status': '404'});
});

// initialize sessionSockets
var sessionSockets = new sessionSocketIO(io, sessionStore, cookieParser, 'dselec.sess');

// add socket.io listeners to wss connection
io.sockets.on('connection', function (socket) {
  socketServer.addListeners(socket);
});

sessionSockets.on('connection', function (err, socket, session) {
  if (err) {
    console.log(err);
  }
  else if (session) {
    socketServer.addSessionListeners(socket, session);
  }
});


exports = module.exports = server;
// delegates user() function
exports.use = function() {
  app.use.apply(app, arguments);
};