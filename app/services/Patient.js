angular.module('Monitoreo')
  .factory('Patient', function ($resource) {
    return $resource('/api/patients/:id',{
      query: { method: 'GET', isArray: true}
    });
  })
