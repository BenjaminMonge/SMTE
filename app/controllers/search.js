angular.module('Monitoreo')
  .controller('SearchController', function ($scope, Patient, Change, $location, Auth) {
    $scope.query = null
    $scope.patients = {}
    //Search query
    $scope.search= function (query) {

      if(!(query==="" || query === null))
      {
        Patient.query({'query': query} ,function (patients) {
        $scope.patients = patients;
      })
    } else {
      $scope.patients = {}
    }

    }

    $scope.logout = function () {
      Auth.logout()
      $location.path('/');
    }
  })
  .directive('ngEnter', function () { //Search on enter
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });
                event.preventDefault();
            }
        });
    };
});
