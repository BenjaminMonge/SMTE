angular.module('Monitoreo')
  .controller('DashController', function ($scope, Change, $rootScope, $resource, User) {
    Change.check();
    //Listening for user change
    $scope.$on('verified', function (event, data) {
      $scope.you = data.user
      $scope.you.joinDate = Date($scope.you.joinDate)
      User.get({username: data.user.username}, function (user) {
        $scope.patients = user.patients
      })

    })

    $scope.deleteUser = function () {
      var userkey = $scope.you.username
      User.delete({username: userkey}, function () {
        console.log('Deleted your account');
      })
    }

  })
