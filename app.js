/*eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require('express');
// bodyp-parse helps to send http requests 
// for more info, see: https://github.com/expressjs/body-parser
var bodyParser = require('body-parser');

// IBM IoT service
var Client = require('ibmiotf').IotfApplication;
var DeviceClient = require('ibmiotf').IotfDevice;

// third-party twilio service
var twilio = require('twilio');

//file system library
var fs = require('fs');


// register server side express.js
var twilioServer= require('./routes/twilioServer');
var raspberryPiServer = require('./routes/raspberryPiServer');

// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');

// create a new express server
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));
app.use('/scripts', express.static(__dirname + '/node_modules/'));

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();

// this iot service config & twilioConfig 
var iotConfig, twilioConfig;

//Loop through user-provided config info and pull out our Twilio credentials
var twilioSid, twilioToken;
var baseConfig = appEnv.getServices('iot-raspberrypi');

//local vcap_service.json ported from Bluemix, but the vcap_service stored in Bluemix is actually different than it provides, that sucks!
if (!baseConfig || Object.keys(baseConfig).length === 0) {
  var configJSON = require('./vcap_service.json');
  configJSON["user-provided"].forEach(function(entry) {
    if (entry.name === 'iot-twilio') {
      twilioConfig = entry;
    }
  })
  configJSON["iotf-service"].forEach(function(entry) {
    if (entry.name === 'iot-raspberrypi') {
      iotConfig = entry;
    }
  })  
} else {
  twilioConfig = baseConfig['iot-twilio'];
  iotConfig = baseConfig['iot-raspberrypi'];
}

console.log('iot config is ' + JSON.stringify(iotConfig));
console.log('twilio config is ' + JSON.stringify(twilioConfig));

twilioSid = twilioConfig.credentials.accountSID;
twilioToken = twilioConfig.credentials.authToken;

var iotAppConfig = {
    "org" : iotConfig.credentials.org,
    "id" : iotConfig.credentials.iotCredentialsIdentifier,
    "auth-method" : "apikey",
    "auth-key" : iotConfig.credentials.apiKey,
    "auth-token" : iotConfig.credentials.apiToken
}

// Nicole's 'Snowy' raspberryPi
var snowyDeviceID = 'b827eb92cee9';
// Liam's 'hhbear' raspberryPi
var hhbearDeviceID = 'b827eb80403e';
// You can put your device ID in here if you want to use the device library
var polarSnowDeviceToken = '';

// only if you use the device library
var iotDeviceConfig = {
    "org" : iotConfig.credentials.org,
    "id" : snowyDeviceID,
    "type" : "raspberrypi",
    "auth-method" : "token",
    "auth-token" : polarSnowDeviceToken
}

var appClient = new Client(iotAppConfig);
var deviceClient = new DeviceClient(iotDeviceConfig);

appClient.connect();
console.log("Successfully connected to our IoT service!");

// subscribe to input events 
appClient.on("connect", function () {
  console.log("subscribe to input events");
  appClient.subscribeToDeviceEvents("raspberrypi");
});

// get device events, we need to initialize this JSON doc with an attribute because it's called by reference
var otherSensor = {"payload":{}};
var allHouses = [{"name":"snowy", "deviceId":snowyDeviceID, "quakePayload":{}, "motionPayload":{}},
                 {"name":"hhbear", "deviceId":hhbearDeviceID, "quakePayload":{}, "motionPayload":{}}];


appClient.on("deviceEvent", function(deviceType, deviceId, eventType, format,payload){
  allHouses.forEach(function(myHouse) {
    if (myHouse.deviceId === deviceId) {
      if ( eventType === 'quakeSensor' ){
        myHouse.quakePayload = JSON.parse(payload);
      } 
      else if (eventType === 'motionSensor'){
        myHouse.motionPayload = JSON.parse(payload);
      }
      else {
        console.log('Got other events of ' + eventType + ' from ' + deviceId);
      } 
    }
  });
  
});

app.post('/message', twilioServer.sendMessage(twilio, twilioSid, twilioToken));
app.get('/sensordata', raspberryPiServer.returnCurrentSensorData(allHouses));
app.get('/sendQuakeAlert', raspberryPiServer.sendQuakeAlert(appClient, snowyDeviceID));

// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function() {
	// print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});
