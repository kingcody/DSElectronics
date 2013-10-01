'use strict';

app.service('$flash', function($rootScope) {
    this.show = function(message) {
      $rootScope.flash = message;
    };

    this.clear = function() {
      $rootScope.flash = '';
    };
  })
  .factory('$session', function() {
    return {
      get: function(key) {
        return sessionStorage.getItem(key);
      },
      set: function(key, value) {
        return sessionStorage.setItem(key, value);
      },
      unset: function(key) {
        return sessionStorage.removeItem(key);
      },
      clear: function() {
        return sessionStorage.clear();
      }
    };
  })
  .service('authService', function($http, $timeout, $q, $session, $flash) {
    this.login = function(credentials) {
      var login = $http.post('/session/login', credentials);
      login.success(function(user) {
        $session.set('user', user);
        $flash.clear();
      }).error(function(error) {
        error = error.error ? error.error : error;
        $flash.show(error.message || error);
      });
      return login;
    };

    this.logout = function() {
      var logout = $http.get('/session/logout');
      logout.success(function() {
        $session.clear();
      });
      return logout;
    };

    this.user = function() {
      var user = $session.get('user');
      if (user) {
        var deferred = $q.defer();
        $timeout(function() {
          deferred.resolve(user);
        }, 0);
        return deferred.promise;
      } else {
        return $http.get('/session/user');
      }
    };
  })
  .config(function($httpProvider) {
    var logsOutUserOn401 = function($location, $q, $session) {
      var success = function(response) {
        return response;
      };

      var error = function(response) {
        if (response.status === 401) {
          $session.unset('user');
          //$location.path('/session/login');
          return $q.reject(response);
        } else {
          return $q.reject(response);
        }
      };

      return function(promise) {
        return promise.then(success, error);
      };
    };

    $httpProvider.responseInterceptors.push(logsOutUserOn401);
  })
  .run(function($rootScope, $location, authService) {
    $rootScope.logout = function () {
      var logout = authService.logout();
      logout.then(function() {
        $location.path('/session/login');
      });
      return logout;
    };
  })
  .run(function($rootScope, $location, authService) {
    var publicRoutes = ['/session/login'];

    $rootScope.$on('$routeChangeStart', function() {
      if (publicRoutes.indexOf($location.path()) === -1) {
        authService.user(); // http responseInterceptor will redirect to /login if this call fails
      }
    });
  });

