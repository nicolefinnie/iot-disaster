/* Client side controllers - angularJS - HTML talks to these controllers */

var quakeMagnitude = 0;
var homeControllers = angular.module('HomeControllers', []);

homeControllers.controller('HomeController', ['$scope', '$rootScope', '$http', '$interval', 
function ($scope, $rootScope, $http, $interval) {
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
          if (myHouse.name === "polarsnow") {
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

function initializeBarChart(){
  var canvas = document.getElementById('floodCanvas');
  ctx = canvas.getContext('2d');
  var barData = {
      labels: ['Humidity'],
      datasets: [
          {
              label: 'Finnie',
              fillColor: "rgba(151,187,205,0.2)",
              strokeColor: "rgba(151,187,205,1)",
              data: [25]
          },   
          {
            label: 'Pradeep',
            fillColor: "rgba(220,220,220,0.2)",
            strokeColor: "rgba(220,220,220,1)",
            data: [20]
        }
      ]
  };
  
  var clientsChart = new Chart(ctx).Bar(barData,
      {animationSteps: 15, 
    scaleOverride : true,
    scaleSteps : 5,
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
             label: "Earthquake Threshold",
             fillColor: "rgba(220,220,220,0.2)",
             strokeColor: "rgba(220,220,220,1)",
             data: quakeThreshold
        },
        {
            label: "Finnie's Nerdy Palace",
            fillColor: "rgba(151,187,205,0.2)",
            strokeColor: "rgba(151,187,205,1)",
            data: quakeSamplePoints
        }, 
        {
          label: "IBM Böblingen Lab",
          fillColor: "rgba(153,204,0,0.2)",
          strokeColor: "rgba(153,204,0,1)",
          data: quakeSamplePoints
      },
        {
          label: "Kai's Kingdom",
          fillColor: "rgba(255,255,0,0.2)",
          strokeColor: "rgba(255,255,0,1)",
          data: quakeSamplePoints
      }
        
    ]
  };

//Reduce the animation steps for demo clarity.
var myLiveChart = new Chart(ctx).Line(startingData, 
    {animationSteps: 15, 
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
    myLiveChart.datasets[1].points[i].value = quakeSamplePoints[i];
  }
  myLiveChart.update();

  }
  , 500);

}
