/* Client side controllers - angularJS - HTML talks to these controllers */

var quakeMagnitude = 0;
var homeControllers = angular.module('HomeControllers', []);

homeControllers.controller('HomeController', ['$scope', '$rootScope', '$http', '$interval', 
function ($scope, $rootScope, $http, $interval) {
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
        if(Object.keys(myHouse.quakePayload).length > 0){
          var payload = JSON.parse(myHouse.quakePayload);
          
          quakeMagnitude = Math.abs(payload.gyroScaledZ) + Math.abs(payload.gyroScaledY) + Math.abs(payload.gyroScaledX);   
          // TODO 
          if (quakeMagnitude > 10) {
            //$scope.sendMessage();
            //$scope.sendQuakeAlert();
            var $toastContent = $('<span>Earthquake detected, sending alerts!!</span>');
            Materialize.toast($toastContent, 1000);
          }
        }
      
        // switch on I'm home
        if(Object.keys(myHouse.motionPayload).length > 0){
          var payload = JSON.parse(myHouse.motionPayload);
          if (myHouse.name === "snowy") {
            $('#minionGirlSwitch').prop('checked', payload.motionDetected);   
          } else if (myHouse.name === "hhbear") {
            $('#minionSwitch').prop('checked', payload.motionDetected);   
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

function initializePolarChart(){
  var canvas = document.getElementById('tsunamiCanvas');
  ctx = canvas.getContext('2d');
  var data = [
              {
                  value: 30,
                  color:"rgba("+ cyan + ",0.5)",
                  highlight: "rgba("+ cyan + ",1)",
                  label: minion
              },
              {
                  value: 5,
                  color:"rgba("+ green + ",0.5)",
                  highlight: "rgba("+ green + ",1)",
                  label: minionGirl
              },
              {
                  value: 10,
                  color:"rgba("+ yellow + ",0.5)",
                  highlight: "rgba("+ yellow + ",1)",
                  label: minionOneEye
              },
              {
                  value: 4,
                  color:"rgba("+ gray + ",0.5)",
                  highlight: "rgba("+ gray + ",1)",
                  label: minionDuck
              }
          ];
  
  var clientsChart = new Chart(ctx).PolarArea(data,
      {animationSteps: 100, 
    scaleOverride : true,
    scaleSteps : 6,
    scaleStepWidth : 5,
    scaleStartValue : 0, 
    scaleShowVerticalLines: false,
    pointDotRadius : 5,
   
    pointDot : false
    });
  
  
}

function initializeBarChart(){
  var canvas = document.getElementById('temperatureCanvas');
  ctx = canvas.getContext('2d');
  var barData = {
      labels: ['Spring', 'Current', 'Summer', 'Autum', 'Winter'],
      datasets: [
          {
              label: minion,
              fillColor: "rgba("+ cyan + ",0.5)",
              strokeColor: "rgba("+ cyan + ",0.8)",
              data: [15, '', 30, 16, 10]
          },
          {
            label: minionGirl,
            fillColor: "rgba("+ green + ",0.5)",
            strokeColor: "rgba("+ green + ",0.8)",
            data: [19, '', 35, 18, 11]
          },
          {
            label: minionOneEye,
            fillColor: "rgba("+ yellow + ",0.5)",
            strokeColor: "rgba("+ yellow + ",0.8)",
            data: [16, '', 33, 19, 13]
          },
          {
            label: minionDuck,
            fillColor: "rgba("+ gray + ",0.5)",
            strokeColor: "rgba("+ gray + ",0.8)",
            data: [18, '', 36, 20, 14]
        }
      ]
  };
  
  var clientsChart = new Chart(ctx).Bar(barData,
      {animationSteps: 15, 
    scaleOverride : true,
    scaleSteps : 4,
    scaleStepWidth : 10,
    scaleStartValue : 0, 
    scaleShowVerticalLines: false,
    pointDotRadius : 5,
   
    pointDot : false
    });
  
 

}

function initializeLineChart(){
  var quakeThreshold = [25, 25, 25, 25, 25, 25, 25, 25, 25, 25];
  var quakeSamplePoints = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  
  var canvas = document.getElementById('quakeCanvas'),
  ctx = canvas.getContext('2d'),
  startingData = {
    labels: ["", "", "", "", "", "", "", "","", ""],
    datasets: [

        {
            label: minion,
            fillColor: "rgba("+ cyan + ",0.2)",
            strokeColor: "rgba("+ cyan + ",1)",
            data: quakeSamplePoints
        }, 
        {
          label: minionGirl,
          fillColor: "rgba("+ green + ",0.2)",
          strokeColor: "rgba("+ green + ",1)",
          data: quakeSamplePoints
      },
        {
          label: minionOneEye,
          fillColor: "rgba("+ yellow + ",0.2)",
          strokeColor: "rgba("+ yellow + ",1)",
          data: quakeSamplePoints
      },
      {
        label: "Earthquake Threshold",
        fillColor: "rgba("+ gray + ",0.2)",
        strokeColor: "rgba("+ gray + ",0.5)",
        data: quakeThreshold
      }
    ]
  };

//Reduce the animation steps for demo clarity.
var myLiveChart = new Chart(ctx).Line(startingData, 
    {animationSteps: 100, 
     scaleOverride : true,
     scaleSteps : 5,
     scaleStepWidth : 10,
     scaleStartValue : 0, 
     scaleShowVerticalLines: false,
     pointDotRadius : 5,
     pointDot : false
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
