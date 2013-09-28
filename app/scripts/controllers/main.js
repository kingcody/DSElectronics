'use strict';

angular.module('DSElectronicsApp')
  .controller('MainCtrl', function ($rootScope, $scope, $http) {
    $rootScope.socket = socket;
    $scope.inventory = [];
    var getThingsFromSocket = function getThingsFromSocket() {
      socket.emit('getInventoryItems', function(d) {
        $scope.$apply(function () {
          $scope.inventory= d.inventory;
        });
        socket.emit('awesomeThingsReceived', { rogerThat: 'socket.IO is a very awesome thing!!!' });
      });
    };
    if (socket.socket.connected) {
      getThingsFromSocket();
    } else {
      var once = false;
      socket.once('connect', function() {
        if (!once) {
          once = true;
          getThingsFromSocket();
        }
      });
      socket.once('reconnect', function() {
        if (!once) {
          once = true;
          getThingsFromSocket();
        }
      });
    }
    $http.get('/api/awesomeThings').success(function(awesomeThings) {
      awesomeThings.forEach(function(e,i) {
        //$scope.awesomeThings.push(e);
      });
    });
  }).controller('inventoryForm', function ($scope) {
    
  });
