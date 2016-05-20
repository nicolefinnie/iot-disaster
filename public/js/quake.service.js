function initializeLineChart(){
  var quakeThreshold = [40, 40, 40, 40, 40, 40, 40, 40, 40, 40];
  var quakeSamplePoints = [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                           [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                           [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                           [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]];
  
  var canvas = document.getElementById('quakeCanvas'),
  ctx = canvas.getContext('2d'),
  startingData = {
    labels: ["", "", "", "", "", "", "", "","", ""],
    datasets: [

        {
            label: minion,
            fillColor: "rgba("+ cyan + ",0.2)",
            strokeColor: "rgba("+ cyan + ",1)",
            data: quakeSamplePoints[0]
        }, 
        {
          label: minionGirl,
          fillColor: "rgba("+ green + ",0.2)",
          strokeColor: "rgba("+ green + ",1)",
          data: quakeSamplePoints[1]
        },
        {
          label: minionOneEye,
          fillColor: "rgba("+ yellow + ",0.2)",
          strokeColor: "rgba("+ yellow + ",1)",
          data: quakeSamplePoints[2]
        },
        {
          label: minionDuck,
          fillColor: "rgba("+ gray + ",0.5)",
          strokeColor: "rgba("+ gray + ",1)",
          data: quakeSamplePoints[3]
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
     scaleSteps : 10,
     scaleStepWidth : 20,
     scaleStartValue : 0, 
     scaleShowVerticalLines: false,
     pointDotRadius : 5,
     pointDot : false
     });


setInterval(function(){
 
  for (var sensor = 0; sensor < numQuakeDetectors; sensor++ ) {
    quakeSamplePoints[sensor].unshift(quakeMagnitude[sensor]);
    // get rid of the oldest earth quake reading
    quakeSamplePoints[sensor].pop();
    // Update one of the points in the second dataset
    for (var i=0; i < startingData.labels.length; i++){
      myLiveChart.datasets[sensor].points[i].value = quakeSamplePoints[sensor][i];
    }
    myLiveChart.update();
  }

  }
  , 500);

}
