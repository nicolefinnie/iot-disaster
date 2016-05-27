/* Client side controllers - angularJS - HTML talks to these controllers */

var homeControllers = angular.module('HomeControllers', []);

homeControllers.controller('HomeController', ['$scope', '$rootScope', '$http', '$interval', 
function ($scope, $rootScope, $http, $interval) {
  $scope.minion = minion;
  $scope.minionGirl = minionGirl;
  $scope.minionOneEye = minionOneEye;
  $scope.minionDuck = minionDuck;
  $scope.isRainMinion = false;
  $scope.isRainMinionGirl = false;
  $scope.isRainMinionOneEye = false;
  $scope.isRainMinionDuck = false;

  // Use of HomeController should use ng-init to call oneTimeInit() the
  // first time the app loads, to ensure it does not collect stale
  // alert data from a long-running server process on Bluemix.
  var initInProgress = true;
  $scope.oneTimeInit = function() {
    var resetData = {
       message: 'reset'
    };
    $http({
      method: 'POST',
      url: '/sensordata',
      data: resetData
    }).then(function successCallback(response) {
      console.log("Initialization complete, starting to read sensor data.");
      initInProgress = false;
    }, function errorCallback(response) {
      console.log("Initialization failed, err: " + JSON.stringify(response));
      initInProgress = false;
    });
  };

  var sendQuakeAlert = function() {
    $http({
      method: 'GET',
      url: '/sendQuakeAlert'
    }).then(function successCallback(response) {
      console.log("Successfully sent earth quake alert");
    }, function errorCallback(response) {
      console.log("failed to listen to sensor data");
    });   
  };
  
  var sendMessage = function(message){
    SMSData.message = message;
    $http({
      method: 'POST',
      url: '/message',
      data: SMSData
    }).then(function successCallback(response) {
      console.log("successfully sent text: " + JSON.stringify(response));
    }, function errorCallback(response) {
      console.log("failed to send text, err: " + JSON.stringify(response));
    });
  };
  
  // Only toast the eqrthquake alert once, to prevent spamming
  var sentQuakeAlert = false;
  var sendAlertsIfNewQuakeDetected = function(quakeDetected){
    if (sentQuakeAlert !== quakeDetected && quakeDetected === true) {
      var $toastContent = $('<span>Earthquake detected, sending alerts!!</span>');
      Materialize.toast($toastContent, 5000);
      sendQuakeAlert();
      sentQuakeAlert = quakeDetected;
      //sendMessage('Danger! Earthquake detected! Seek immediate cover!');
      console.log('Danger! Earthquake detected! Seek immediate cover!');
    }
  }

  var sentSingleAlert = false;
  // Set of all tasks that should be performed periodically
  var runIntervalTasks = function() {
    // Do not read any sensor data until after our init is complete
    if (initInProgress === false)
    {
      $http({
        method: 'GET',
        url: '/sensordata'
      }).then(function successCallback(response) {
        var isQuake = response.data[0].quakeAlert;
        sendAlertsIfNewQuakeDetected(isQuake);
        // If we have not detected a quake, then if one sensor is showing a potential
        // for a quake, send an SMS.
        if (!isQuake && (sentSingleAlert === false) && response.data[0].possibleQuakeAlert) {
          sentSingleAlert = true;
          //sendMessage('Warning! Possible earthquake detected. Stand by for further instructions.');
          console.log('Warning! Possible earthquake detected. Stand by for further instructions.');
        }
  
        response.data.forEach(function(myHouse){
  
          // only if the device is sending data, we update earthquake data, when no data is sending, the payload is like {} 
          if (myHouse.quakePayload !== undefined) {
            if(Object.keys(myHouse.quakePayload).length > 0){
              var payload = myHouse.quakePayload;
  
              var myQuakeMagnitude = Math.abs(payload.gyroScaledZ) + Math.abs(payload.gyroScaledY) + Math.abs(payload.gyroScaledX);   
              if (myHouse.name === "snowy") {
                quakeMagnitude[minionGirlQuakeIndex] = myQuakeMagnitude;
              } 
              else if (myHouse.name === "hhbear") {
                quakeMagnitude[minionQuakeIndex] = myQuakeMagnitude;
              } 
              else if (myHouse.name === "snail") {
                quakeMagnitude[minionOneEyeQuakeIndex] = myQuakeMagnitude;
              } 
              else if (myHouse.name === "squirrel") {
                quakeMagnitude[minionDuckQuakeIndex] = myQuakeMagnitude;
              }
            }
          }   
          if (myHouse.motionPayload !== undefined) {
            // switch on I'm home
            if(Object.keys(myHouse.motionPayload).length > 0){
              var payload = JSON.parse(myHouse.motionPayload);
              if (myHouse.name === "snowy") {
                $('#minionGirlSwitch').prop('checked', payload.motionDetected);   
              } 
              else if (myHouse.name === "hhbear") {
                $('#minionSwitch').prop('checked', payload.motionDetected);   
              } 
              else if (myHouse.name === "snail") {
                $('#minionOneEyeSwitch').prop('checked', payload.motionDetected);
              } 
              else if (myHouse.name === "squirrel") {
                $('#minionDuckSwitch').prop('checked', payload.motionDetected);
              }
            }
          }

          if(myHouse.humiturePayload !==undefined) {
            if(Object.keys(myHouse.humiturePayload).length > 0) {
                var payload = JSON.parse(myHouse.humiturePayload);
                if(myHouse.name == "hhbear") {
                  humidReadings[minionQuakeIndex] = payload.humid;
                  temperatureReadings[minionQuakeIndex] = payload.temp;
                }
                else if(myHouse.name == "snowy") {
                  humidReadings[minionGirlQuakeIndex] = payload.humid;
                  temperatureReadings[minionGirlQuakeIndex] = payload.temp;
                }
                else if(myHouse.name == "snail") {
                  humidReadings[minionOneEyeQuakeIndex] = payload.humid;
                  temperatureReadings[minionOneEyeQuakeIndex] = payload.temp;
                }
                else if(myHouse.name == "squirrel") {
                    humidReadings[minionDuckQuakeIndex] = payload.humid;
                    temperatureReadings[minionDuckQuakeIndex] = payload.temp;
                }
            }
          }
          // rain drop
          if(myHouse.rainPayload !== undefined) {
            if(Object.keys(myHouse.rainPayload).length > 0) {
              var payload = JSON.parse(myHouse.rainPayload);
              if(myHouse.name == "hhbear") {
                $scope.isRainMinion = payload.rainDetected;
              }
              else if(myHouse.name == "snowy") {
                $scope.isRainMinionGirl = payload.rainDetected;
              }
              else if(myHouse.name == "snail") {
                $scope.isRainMinionOneEye = payload.rainDetected;
              }
              else if(myHouse.name == "squirrel") {
                $scope.isRainMinionDuck = payload.rainDetected;
              }
            }
          }
          
        });
        
        
      }, function errorCallback(response) {
          console.log("failed to listen to sensor data");
      });   
    }
  };

  var polling; // promise, set when we start intervals, used to cancel intervals.
  var startPolling = function(pollingInterval) {
    polling = $interval(function() {
      runIntervalTasks();
    }, pollingInterval);
  };

  var stopPolling = function() {
    if (angular.isDefined(polling)) {
      $interval.cancel(polling);
      polling = undefined;
    }
  };
  // Someone asked us to refresh
  $rootScope.$on('refreshSensorData', function(){
    // Check for new input events twice per second
    var pollingInterval = 200;
    // Prevent race conditions - stop any current polling, then issue a new
    // refresh task immediately, and then start polling.  Note that polling
    // sleeps first, so we won't be running two refreshes back-to-back.
    stopPolling();
    runIntervalTasks();
    startPolling(pollingInterval);
  });

  // Tell ourselves to refresh new mail count and start polling
  $rootScope.$broadcast('refreshSensorData');
  $scope.$on('$destroy', function() {
    stopPolling();
  });
}
]);

