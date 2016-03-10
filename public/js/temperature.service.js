
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