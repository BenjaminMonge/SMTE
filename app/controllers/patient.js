angular.module('Monitoreo')
.controller('PatientController', function ($scope, Patient, socketFactory, $routeParams, Change, $http) {
    //Gotta solve this
    Change.check();

    //Chart code
    $scope.labels = ["6s", "5s", "4s", "3s", "2s", "1s", "Now"];
    $scope.series = ['Latidos por minuto'];
    $scope.data = [
     [60, 60, 60, 60, 60, 60, 60]
   ];

  $scope.datasetOverride = [{ yAxisID: 'y-axis-1' }];
  $scope.options = {
   scales: {
     yAxes: [
       {
         id: 'y-axis-1',
         type: 'linear',
         display: true,
         position: 'left',
         ticks: {
                suggestedMin: 0,    // minimum will be 0, unless there is a lower value.
                suggestedMax: 100
            }
       }
     ]
   }
 };
    //
    //Get data first
    $scope.patient = {}
    $scope.vitals = {'bpm': 60}//, 'state': 'walking'};
    Patient.get({id: $routeParams.patient} ,function (patient) {
      $scope.patient = patient
      if(patient.isWatching){$scope.care="Abandonar"}
      else {$scope.care = "Vigilar"}
    })
    //Connect to data stream
    var socket = socketFactory();
    const streamURL = 'stream:'+$routeParams.patient
    socket.emit('patient', streamURL)
    //Listening for incomming data from the connected socket
    socket.on('bpm', function (data) {
      console.log('got data')
      if($scope.data[0].length===7) {$scope.data[0].shift()}
      $scope.data[0].push(data.bpm)
      $scope.vitals = data;
    })
    //Listening for destroy in order to log out of the room
    $scope.$on("$destroy", function() {
        socket.emit('left', streamURL)
    });

    //Add the user to watch list
    $scope.watch = function () {
      if ($scope.patient.isWatching) {
        var urlDel = '/api/monitors/'+$routeParams.patient
        $http.delete(urlDel).then(function success(msg) {
          $scope.care = 'Vigilar'
          $scope.patient.isWatching = false
        }, function failure(err) {
            console.log(err);
        })
      } else {
        $http.post('/api/monitors', {deviceid: $scope.patient.deviceid}).then(function success(msg){
          $scope.care = 'Abandonar'
          $scope.patient.isWatching = true
        }, function failure(error) {
          console.log(error);
        })
      }

    }

  })
