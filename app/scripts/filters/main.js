'use strict';

app.filter('loginButton', ['$rootScope', function () {
  return function (auth, logBtn) {
    if (logBtn == true) {
      if (auth === 0) {
        return '';
      }
      else {
        return 'hidden';
      }
    }
    else if (logBtn == false) {
      if (auth === 1) {
        return '';
      }
      else {
        return 'hidden';
      }
    }
  };
}]);

