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
     scaleSteps : 10,
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
