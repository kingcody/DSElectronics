/*jslint node: true */
'use strict';
var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    routes = require('./routes');

app.use(express.bodyParser());

app.get('/api/awesomeThings', routes.awesomeThings);

app.use(function (req, res) {
    res.json({'ok': false, 'status': '404'});
});

io.sockets.on('connection', function (socket) {
  socket.on('getInventoryItems', function(fn) {
    fn({inventory: JSON.parse(require('fs').readFileSync('data/inventoryItems.json'))});
  });
  socket.on('awesomeThingsReceived', function (data) {
    console.log(data);
  });
});

exports = module.exports = server;
// delegates user() function
exports.use = function() {
  app.use.apply(app, arguments);
};