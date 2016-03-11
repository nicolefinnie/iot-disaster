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
       console.log("successfully sent text " + JSON.stringify(response));
    }, function errorCallback(response) {
        console.log("failed to send text");
    });
  };
  
  // this is a timer that prevents toasts to be spammed
  $scope.toastState = false;
  var toastIfNewQuakeDetected = function(input){
	  if ($scope.toastState !== input && input === true) {
		  var $toastContent = $('<span>Earthquake detected, sending alerts!!</span>');
		  $scope.sendQuakeAlert;
          Materialize.toast($toastContent, 5000);
	  }
	  $scope.toastState = input;
  }
  

   // Set of all tasks that should be performed periodically
  $scope.runIntervalTasks = function() {
  
    $http({
      method: 'GET',
      url: '/sensordata'
    }).then(function successCallback(response) {
    	
      var isQuake = response.data[0].quakeAlert;
      toastIfNewQuakeDetected(isQuake);
      
      response.data.forEach(function(myHouse){
    	
        // only if the device is sending data, we update earthquake data, when no data is sending, the payload is like {} 
        if (myHouse.quakePayload !== undefined) {
          if(Object.keys(myHouse.quakePayload).length > 0){
            var payload = myHouse.quakePayload;
  
            var myQuakeMagnitude = Math.abs(payload.gyroScaledZ) + Math.abs(payload.gyroScaledY) + Math.abs(payload.gyroScaledX);   
            if (myHouse.name === "snowy") {
              quakeMagnitude[minionGirlQuakeIndex] = myQuakeMagnitude;
            } else if (myHouse.name === "hhbear") {
              quakeMagnitude[minionQuakeIndex] = myQuakeMagnitude;
            } else if (myHouse.name === "snail") {
              quakeMagnitude[minionOneEyeQuakeIndex] = myQuakeMagnitude;
            }// else if (myHouse.name === "OTHER_DEVICE_NAME")
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
            } else if (myHouse.name === "snail") {
              $('#minionOneEyeSwitch').prop('checked', payload.motionDetected);
            }
          }
        }
        
        if(myHouse.humiturePayload !==undefined) {
          if(Object.keys(myHouse.humiturePayload).length > 0) {
              var payload = JSON.parse(myHouse.humiturePayload);
              if(myHouse.name == "squirrel") {
                  humidReadings[minionDuckQuakeIndex] = payload.humid;
                  temperatureReadings[minionDuckQuakeIndex] = payload.temp;
               
              }
              else if(myHouse.name == "snowy") {
                  humidReadings[minionGirlQuakeIndex] = payload.humid;
                  temperatureReadings[minionGirlQuakeIndex] = payload.temp;
              }

          }
        }
        // rain drop
        if(myHouse.rainPayload !== undefined) {
          if(Object.keys(myHouse.rainPayload).length > 0) {
            var payload = JSON.parse(myHouse.rainPayload);
            console.log(' rain payload ' + JSON.stringify(payload));
              if(myHouse.name == "squirrel") {
                  //It's just Pradeep's house here !
                  //raindropReadings[minionDuckQuakeIndex] = payload.rainDetected;
                $scope.raindrop = payload.rainDetected === 0 ? true : false;
                console.log('Rain drop ' + payload.rainDetected);
               
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

