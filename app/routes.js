angular.module('Monitoreo', ['ngRoute', 'ngResource'])
  .config(function ($routeProvider, $locationProvider) {
    $routeProvider
    .when('/', {templateUrl: 'app/views/home.html', controller: 'HomeController'})
    .when('/dashboard', {templateUrl: 'app/views/dashboard.html', controller: 'DashController'})
    .when('/monitor/:patient', {templateUrl: 'app/views/patient.html', controller: 'PatientController'})
    .when('/search', {templateUrl: 'app/views/search.html', controller: 'SearchController'})
    .otherwise({redirectTo: '/'})
  })
