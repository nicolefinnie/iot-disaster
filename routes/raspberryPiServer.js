/*eslint-env node */

exports.sendQuakeAlert = function(appClient, deviceId){
  return function(req, res) {
    console.log('Trying to send alert');
    var myData = {'command' : 'alert'};
    console.log('Send an earthquake alert '+ JSON.stringify(myData));
    appClient.publishDeviceEvent("raspberrypi", deviceId, "earthquake", "json", JSON.stringify(myData));
  };
};


// client asks server for the sensor data, and server sends back the sensor data
exports.returnCurrentSensorData = function(sensorData){
  return function(req, res){
    res.send(sensorData);
    
  };
};
