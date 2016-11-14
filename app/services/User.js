angular.module('Monitoreo')
  .factory('User', function ($resource) {
    return $resource('/api/users/:username');
  })
