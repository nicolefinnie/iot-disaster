
function initializeBarChart(){
  var canvas = document.getElementById('temperatureCanvas');
  ctx = canvas.getContext('2d');
  var barData = {
      labels: ['', 'Temperature',''],
      datasets: [
          {
              label: minion,
              fillColor: "rgba("+ cyan + ",0.5)",
              strokeColor: "rgba("+ cyan + ",0.8)",
              data: ['', 25, '']
          },
          {
            label: minionGirl,
            fillColor: "rgba("+ green + ",0.5)",
            strokeColor: "rgba("+ green + ",0.8)",
            data: ['', 23, '']
          },
          {
            label: minionOneEye,
            fillColor: "rgba("+ yellow + ",0.5)",
            strokeColor: "rgba("+ yellow + ",0.8)",
            data: ['', 22, '']
          },
          {
            label: minionDuck,
            fillColor: "rgba("+ gray + ",0.5)",
            strokeColor: "rgba("+ gray + ",0.8)",
            data: ['', 26, '']
        }
      ]
  };
  
  var clientsChart = new Chart(ctx).Bar(barData,
      {animationSteps: 10, 
    scaleOverride : true,
    scaleSteps : 4,
    scaleStepWidth : 10,
    scaleStartValue : 0, 
    scaleShowVerticalLines: false,
    pointDotRadius : 5,
   
    pointDot : false
    });
  
  setInterval(function(){
    for (var sensor = 0; sensor < numTemperatureDetectors; sensor++ ) {
      clientsChart.datasets[sensor].bars[1].value = temperatureReadings[sensor];
      clientsChart.update();
    }
    }
    , 500);
  
}