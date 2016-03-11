/* Client side controllers - angularJS - HTML talks to these controllers */

var homeControllers = angular.module('HomeControllers', []);

homeControllers.controller('HomeController', ['$scope', '$rootScope', '$http', '$interval', 
function ($scope, $rootScope, $http, $interval) {
  $scope.raindrop = false;
  $scope.minion = minion;
  $scope.minionGirl = minionGirl;
  $scope.minionOneEye = minionOneEye;
  $scope.minionDuck = minionDuck;
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
  
  $scope.sendMessage = function(){
    //TODO register phoneNumber and message
    var msgData = { 'phoneNumber': $scope.phoneNumber, 
                    'message': $scope.message};
    $http({
      method: 'POST',
      url: '/message',
      data: msgData
    }).then(function successCallback(response) {
       console.log("successfully sent text");
    }, function errorCallback(response) {
        console.log("failed to send text");
    });
  };
  
   // Set of all tasks that should be performed periodically
  $scope.runIntervalTasks = function() {
  
    $http({
      method: 'GET',
      url: '/sensordata'
    }).then(function successCallback(response) {
      response.data.forEach(function(myHouse){
        // only if the device is sending data, we update earthquake data, when no data is sending, the payload is like {} 
        if (myHouse.quakePayload !== undefined) {
          if(Object.keys(myHouse.quakePayload).length > 0){
            var payload = JSON.parse(myHouse.quakePayload);
  
            var myQuakeMagnitude = Math.abs(payload.gyroScaledZ) + Math.abs(payload.gyroScaledY) + Math.abs(payload.gyroScaledX);   
            if (myHouse.name === "snowy") {
              quakeMagnitude[minionGirlQuakeIndex] = myQuakeMagnitude;
            } else if (myHouse.name === "hhbear") {
              quakeMagnitude[minionQuakeIndex] = myQuakeMagnitude;
            } // else if (myHouse.name === "OTHER_DEVICE_NAME")
            // TODO 
            if (myQuakeMagnitude > 10) {
              //$scope.sendMessage();
              //$scope.sendQuakeAlert();
              var $toastContent = $('<span>Earthquake detected, sending alerts!!</span>');
              Materialize.toast($toastContent, 1000);
            }
          }
        }   
        if (myHouse.motionPayload !== undefined) {
          // switch on I'm home
          if(Object.keys(myHouse.motionPayload).length > 0){
            var payload = JSON.parse(myHouse.motionPayload);
            if (myHouse.name === "snowy") {
              $('#minionGirlSwitch').prop('checked', payload.motionDetected);   
            } else if (myHouse.name === "hhbear") {
              $('#minionSwitch').prop('checked', payload.motionDetected);   
            }
          }
        }
        
      });
      
      
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
}
]);

