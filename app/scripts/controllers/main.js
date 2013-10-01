'use strict';

app.controller('mainCtrl', function ($rootScope) {
    $rootScope.authenticated = 0;
    $rootScope.socket = socket;
  })
  .controller('navMenu', function ($scope, authService) {

    // function to show login form if socket is connected
    $scope.loginModal = function () {
      if ($scope.socket.socket.connected) {
        $('#loginModal').modal('show');
      }
    };
  })
  .controller('loginModal', function ($scope, $rootScope, authService) {
    $scope.loginForm = {
      username: '',
      password: '',
      remember: false
    };

    $scope.login = function() {
      authService.login(this.loginForm).success(function() {
        $rootScope.authenticated = 1;
        // DO LOGGED IN STUFF!!!!
      });
    };
  })
  .controller('welcome', function ($scope, $http) {
    $scope.awesomeThings = [];
    $http.get('/api/awesomeThings').success(function(awesomeThings) {
      awesomeThings.forEach(function(e,i) {
        $scope.awesomeThings.push(e);
      });
    });

    var getThingsFromSocket = function getThingsFromSocket() {
      $scope.socket.emit('getAwesomeThings', function(d) {
        $scope.$apply(function () {
          d.awesomeThings.forEach(function(e,i) {
            $scope.awesomeThings.push(e);
          });
        });
        $scope.socket.emit('awesomeThingsReceived', { rogerThat: 'socket.IO is a very awesome thing!!!' });
      });
    };

    if ($scope.socket.socket.connected) {
      getThingsFromSocket();
    }
    else {
      var once = false;
      $scope.socket.once('connect', function() {
        if (!once) {
          once = true;
          getThingsFromSocket();
        }
      });
      $scope.socket.once('reconnect', function() {
        if (!once) {
          once = true;
          getThingsFromSocket();
        }
      });
    }

  })
  .controller('inventory', function ($scope) {
    $scope.inventory = [];

    var getThingsFromSocket = function getThingsFromSocket() {
      $scope.socket.emit('getInventoryItems', function(d) {
        $scope.$apply(function () {
          $scope.inventory= d.inventory;
        });
      });
    };

    if ($scope.socket.socket.connected) {
      getThingsFromSocket();
    }
    else {
      var once = false;
      $scope.socket.once('connect', function() {
        if (!once) {
          once = true;
          getThingsFromSocket();
        }
      });
      $scope.socket.once('reconnect', function() {
        if (!once) {
          once = true;
          getThingsFromSocket();
        }
      });
    }
  });
