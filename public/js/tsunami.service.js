
function initializePieChart(){
    //hhbear minion
    var data1 = [
            {
              value: 30,
              color: "rgba("+cyan+",0.8)",
              highlight: "rgba("+cyan+",1)",
              label: "Humiture"
                
            },
            {
              value: 70,
              color: "rgba("+cyan+",0.1)",
              highlight: "rgba("+cyan+",0.5)",
              label: "Full humiture"
            }
          ];
    //snowy - girl 
    var data2 = [
            {
               value: 33,
               color: "rgba("+green+",0.8)",
               highlight: "rgba("+green+",1)",
               label: "Humiture"
            },
             {
               value: 67,
               color: "rgba("+green+",0.1)",
               highlight: "rgba("+green+",0.5)",
               label: "Full humiture"
             }
           ];    
    //snail - one eye
    var data3 = [
             {
                value: 34,
                color: "rgba("+yellow+",0.8)",
                highlight: "rgba("+yellow+",1)",
                label: "Humiture"
             },
              {
                value: 66,
                color: "rgba("+yellow+",0.1)",
                highlight: "rgba("+yellow+",0.5)",
                label: "Full humiture"
              }
            ];    
    //squirrel duck
    var data4 = [
             {
               value: 35,
               color: "rgba("+gray+",0.8)",
               highlight: "rgba("+gray+",1)",
               label: "Humiture"
                 
             },
             {
               value: 65,
               color: "rgba("+gray+",0.1)",
               highlight: "rgba("+gray+",0.5)",
               label: "Full humiture"
             }
          ];
  
  var doughnutChart1 = new Chart(document.getElementById('humitureCanvas1').getContext('2d')).Doughnut(data1,
      {animationSteps: 100, 
    scaleOverride : true,
    scaleSteps : 6,
    scaleStepWidth : 5,
    scaleStartValue : 0
    });
  
  var doughnutChart2 = new Chart(document.getElementById('humitureCanvas2').getContext('2d')).Doughnut(data2,
      {animationSteps: 100, 
    scaleOverride : true,
    scaleSteps : 6,
    scaleStepWidth : 5,
    scaleStartValue : 0
    });
  
  var doughnutChart3 = new Chart(document.getElementById('humitureCanvas3').getContext('2d')).Doughnut(data3,
      {animationSteps: 100, 
    scaleOverride : true,
    scaleSteps : 6,
    scaleStepWidth : 5,
    scaleStartValue : 0
    });
   
  var doughnutChart4 = new Chart(document.getElementById('humitureCanvas4').getContext('2d')).Doughnut(data4,
      {animationSteps: 100, 
    scaleOverride : true,
    scaleSteps : 6,
    scaleStepWidth : 5,
    scaleStartValue : 0
    });
  
  setInterval(function(){

    doughnutChart1.segments[0].value = humidReadings[minionQuakeIndex];
    doughnutChart1.segments[1].value = 100 - humidReadings[minionQuakeIndex];
    doughnutChart1.update();

    doughnutChart2.segments[0].value = humidReadings[minionGirlQuakeIndex];
    doughnutChart2.segments[1].value = 100 - humidReadings[minionGirlQuakeIndex];
    doughnutChart2.update();

    doughnutChart3.segments[0].value = humidReadings[minionOneEyeQuakeIndex];
    doughnutChart3.segments[1].value = 100 - humidReadings[minionOneEyeQuakeIndex];
    doughnutChart3.update();

    doughnutChart4.segments[0].value = humidReadings[minionDuckQuakeIndex];
    doughnutChart4.segments[1].value = 100 - humidReadings[minionDuckQuakeIndex];
    doughnutChart4.update();

    }
    , 500);
  
}