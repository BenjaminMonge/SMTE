angular.module('Monitoreo').factory('Change',
  function ($rootScope, $location, Auth) {

  return {
    check: function () {
    $rootScope.$watch('currentUser', function (currentUser) {
      if (!currentUser && (['' ,'/'].indexOf($location.path()) == -1)){
          Auth.currUser();
      }
    })

    }
  }

})
