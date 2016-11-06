angular.module('Monitoreo')
  .controller('HomeController',
  function ($scope, Auth, User, $location) {

    $scope.alert= {'session': 'Debes crear una cuenta'}
    //All the angular stuff
    $scope.signup = function () {
      var client = angular.toJson($scope.member)
      User.save(client, function(user) {
        $scope.member = {}
        $location.path('/dashboard')
      }, function (err) {
          $scope.alert.session = "Error"
          $scope.member = {}
      })
    }

    $scope.login = function () {
      Auth.login('password', {
        'username': $scope.credentials.username,
        'password': $scope.credentials.password
      }, function (username, err) {
        if(!err){
          $location.path('/dashboard')
        } else {
          $scope.alert.session = 'Credenciales incorrectas'
        }
      });
    }

  })
