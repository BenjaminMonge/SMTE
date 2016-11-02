angular.module('Monitoreo')
  .controller('DashController', function ($scope, Change, $rootScope) {
    Change.check();
    //Listening for user change
    $scope.$on('verified', function (event, data) {
      $scope.you = data.user.username
    })

  })
