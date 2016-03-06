/* Client side controllers - angularJS - HTML talks to these controllers */

var homeControllers = angular.module('HomeControllers', []);


homeControllers.controller('HomeController', ['$scope', '$rootScope', '$http', '$interval',
function ($scope, $rootScope, $http, $interval) {
  var quakeMagnitude = 0;
  $scope.sendQuakeAlert = function() {
    $http({
      method: 'GET',
      url: '/sendQuakeAlert'
    }).then(function successCallback(response) {
       console.log("Successfully sent earth quake alert");
    }, function errorCallback(response) {
        console.log("failed to listen to sensor data");
    });   
  };
  
   // Set of all tasks that should be performed periodically
  $scope.runIntervalTasks = function() {
  
    $http({
      method: 'GET',
      url: '/sensordata'
    }).then(function successCallback(response) {
      // only if the device is sending data, we update earthquake data, when no data is sending, the payload is like {} 
      if(Object.keys(response.data.payload).length > 0){
          var payload = JSON.parse(response.data.payload);
          quakeMagnitude = Math.abs(payload.gyroScaledZ) + Math.abs(payload.gyroScaledY) + Math.abs(payload.gyroScaledX);   
          // TODO 
          if (quakeMagnitude > 100) {
            $scope.sendQuakeAlert();
          }
       }
    }, function errorCallback(response) {
        console.log("failed to listen to sensor data");
    });   
  };

  var polling; // promise, set when we start intervals, used to cancel intervals.
  $scope.startPolling = function(pollingInterval) {
    polling = $interval(function() {
      $scope.runIntervalTasks();
    }, pollingInterval);
  };

  $scope.stopPolling = function() {
    if (angular.isDefined(polling)) {
      $interval.cancel(polling);
      polling = undefined;
    }
  };
  // Someone asked us to refresh
  $rootScope.$on('refreshSensorData', function(){
    // Check for new input events every second
    var pollingInterval = 500;
    // Prevent race conditions - stop any current polling, then issue a new
    // refresh task immediately, and then start polling.  Note that polling
    // sleeps first, so we won't be running two refreshes back-to-back.
    $scope.stopPolling();
    $scope.runIntervalTasks();
    $scope.startPolling(pollingInterval);
  });

  // Tell ourselves to refresh new mail count and start polling
  $rootScope.$broadcast('refreshSensorData');
  $scope.$on('$destroy', function() {
    $scope.stopPolling();
  });


  var quakeSamplePoints = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,0,0,0];
  
  var canvas = document.getElementById('canvas'),
  ctx = canvas.getContext('2d'),
  startingData = {
    labels: ["", "", "", "", "", "", "", "","", "", "", "","", "", "", "","", "", "", "",""],
    datasets: [
        {
            fillColor: "rgba(151,187,205,0.2)",
            strokeColor: "rgba(151,187,205,1)",
            pointColor: "rgba(151,187,205,1)",
            pointStrokeColor: "#fff",
            data: quakeSamplePoints
        }
    ]
  };

//Reduce the animation steps for demo clarity.
var myLiveChart = new Chart(ctx).Line(startingData, 
    {animationSteps: 15, 
     scaleOverride : true,
     scaleSteps : 10,
     scaleStepWidth : 30,
     scaleStartValue : 0 
     });


setInterval(function(){
 
  quakeSamplePoints.unshift(quakeMagnitude);
  // get rid of the oldest earth quake reading
  quakeSamplePoints.pop();
  
  // Update one of the points in the second dataset
  for (var i=0; i < startingData.labels.length; i++){
    myLiveChart.datasets[0].points[i].value = quakeSamplePoints[i];
  }
  myLiveChart.update();

  }
  , 500);

}
]);


homeControllers.controller('MessageController', ['$scope', '$http', 
  function ($scope, $http) {
  $scope.sendMessage = function(){
  
    var msgData = { 'phoneNumber': $scope.phoneNumber, 
                    'message': $scope.message};
    $http({
      method: 'POST',
      url: '/message',
      data: msgData
    }).then(function successCallback(response) {
        // this callback will be called asynchronously
        // when the response is available
        console.log("successfully sent text");
    }, function errorCallback(response) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
        console.log("failed to send text");
    });
  };
}
]);






