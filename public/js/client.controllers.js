/* Client side controllers - angularJS - HTML talks to these controllers */

var homeControllers = angular.module('HomeControllers', []);

homeControllers.controller('HomeController', ['$scope', '$rootScope', '$http', '$interval',
function ($scope, $rootScope, $http, $interval) {
  
   // Set of all tasks that should be performed periodically
  $scope.runIntervalTasks = function() {
  
    $http({
      method: 'GET',
      url: '/sensordata'
    }).then(function successCallback(response) {
        console.log("successfully listen to sensor data " + JSON.stringify(response));
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
    var pollingInterval = 1000;
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

homeControllers.controller('LightController', ['$scope', '$http', 
   function ($scope, $http) {
    $scope.isLightOn = false;
    $scope.switchOnOff = "Turn on light";
    
    $scope.switchLight = function (){
      $scope.isLightOn = !$scope.isLightOn;
      if($scope.isLightOn === true) {
        $scope.switchOnOff = "Turn off light";
      } else {
        $scope.switchOnOff = "Turn on light";
      }
      
      var msgData = { 'newLightState': $scope.isLightOn};
      $http({
      method: 'POST',
      url: '/switchLight',
      data: msgData
      }).then(function successCallback(response) {
        // this callback will be called asynchronously
        // when the response is available
        console.log("successfully sent light message");
      }, function errorCallback(response) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
        console.log("failed to send light message");
      });
   };
 }
 ]);





