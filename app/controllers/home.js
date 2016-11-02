angular.module('Monitoreo')
  .controller('HomeController',
  function ($scope, Auth, User, $location) {
    $scope.alert= {'session': 'You must create an account'}
    //All the angular stuff
    $scope.signup = function () {
      var client = angular.toJson($scope.member)
      User.save(client, function(user) {
        console.log(user);
        $scope.member = {}
        $scope.alert.session = 'Now you may login'
      }, function (err) {
          $scope.alert.session = err.data
          $scope.member = {}
      })
    }

    $scope.login = function () {
      Auth.login('password', {
        'username': $scope.credentials.username,
        'password': $scope.credentials.password
      }, function (username, err) {
        if(!err){
          $location.path('/dashboard/')
        } else {
          console.log(err);
        }
      });
    }

  })
