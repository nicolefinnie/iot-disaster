/*eslint-env node */
exports.switchLight = function(appClient, deviceId){
  return function(req, res) {
    var calledCounter = 0;
    appClient.connect();
    console.log("Successfully connected to our IoT service!");
    console.log('switch light is ' + JSON.stringify(req.body));
      appClient.log.setLevel('trace');
      appClient.on("connect", function() {
          if (calledCounter === 0) {
            var command = ( req.body.newLightState === true) ? 'on' : 'off';
            var myData = {'command' : command};
            console.log('deviceID is '+deviceId);
            console.log('my command is '+ JSON.stringify(myData));
            appClient.publishDeviceEvent("raspberrypi", deviceId, "light", "json", JSON.stringify(myData));
          }
          calledCounter++;
      });
  };
};

exports.returnCurrentSensorData = function(sensors){
  return function(req, res){
    // return sensors in JSON
    res.send(sensors);
  };
};
