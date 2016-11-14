angular.module('Monitoreo')
.factory('Session', function ($resource) {
    return $resource('/api/sessions/')
  })
