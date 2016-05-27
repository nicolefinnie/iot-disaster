/*eslint-env node */

exports.sendQuakeAlert = function(appClient, deviceId, sendAlertCounter){
   return function(req, res) {
    appClient.connect();
    console.log('Trying to send alert');
      appClient.on("connect", function() {
          if (sendAlertCounter === 0) {
            var myData = {'command' : 'alert'};
            console.log('deviceID is '+deviceId);
            console.log('my command is '+ JSON.stringify(myData));
            appClient.publishDeviceEvent("raspberrypi", deviceId, "earthquake", "json", JSON.stringify(myData));
          }
          sendAlertCounter++;
          console.log("send alert counter: " + sendAlertCounter);
      });
  };
};


// client asks server for the sensor data, and server sends back the sensor data
exports.returnCurrentSensorData = function(sensorData){
  return function(req, res){
    res.send(sensorData);
    
  };
};
