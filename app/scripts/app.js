'use strict';


  var socket = io.connect(':9001', {secure: true});

var app = angular.module('DSElectronicsApp', [])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'welcome'
      }).when('view/inventory', {
        templateUrl: 'apiViews/inventory',
        controller: 'inventory'
      })
      .otherwise({
        redirectTo: '/'
      });
  });