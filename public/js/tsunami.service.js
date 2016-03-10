
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