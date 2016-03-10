
function initializePieChart(){
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
    
    var data2 = [
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
  
  
}