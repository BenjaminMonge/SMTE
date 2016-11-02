angular.module('Monitoreo')
.factory('Session', function ($resource) {
    return $resource('/auth/session/')
  })
