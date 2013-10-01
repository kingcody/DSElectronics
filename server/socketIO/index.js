/*
 *    Socket.IO Server
 */

// Variables
var socketServer = {};

var listeners = {
  socketListeners: [
    {
      on: 'getAwesomeThings',
      fn: function(fn) {
        fn({
          awesomeThings: ['Socket.IO']
        });
      }
    }
  ],
  sessionListeners: [
    {
      on: 'getInventoryItems',
      fn: function(fn) {
        fn({
          inventory: JSON.parse(require('fs').readFileSync('data/inventoryItems.json'))
        });
      }
    }
  ]
};


socketServer.addListeners = function(socket, callback) {
  listeners.socketListeners.forEach(function(e,i,a){
    socket.on(e.on, e.fn);
  });

};

socketServer.addSessionListeners = function(socket, session, callback) {
  listeners.sessionListeners.forEach(function(e,i,a){
    socket.on(e.on, e.fn);
  });

  socket.emit('sessionConnected', session);
};


exports = module.exports = socketServer;