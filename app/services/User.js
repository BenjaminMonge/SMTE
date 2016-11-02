angular.module('Monitoreo')
  .factory('User', function ($resource) {
    return $resource('/api/user/:username');
  })
