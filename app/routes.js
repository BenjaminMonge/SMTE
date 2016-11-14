angular.module('Monitoreo', ['ngRoute', 'ngResource', 'btford.socket-io', 'chart.js'])
  .config(function ($routeProvider, $locationProvider) {
    $routeProvider
    .when('/', {templateUrl: 'app/views/home.html', controller: 'HomeController'})
    .when('/dashboard/', {templateUrl: 'app/views/dashboard.html', controller: 'DashController'})
    .when('/monitor/:patient', {templateUrl: 'app/views/patient.html', controller: 'PatientController'})
    .otherwise({redirectTo: '/'})
  })
