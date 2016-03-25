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
// Pradeep's 'Squirrel' raspberryPi 
//Need changes here !
var squirrelDeviceID ='b827eb930823';
// Pradeep's Device token
var squirrelDeviceToken = 's9YegBi@NvRlzJedf+';
// Kai's 'snail' raspberryPi
var snailDeviceID = 'b827ebacefce';


// only if you use the device library
var iotDeviceConfig = {
    "org" : iotConfig.credentials.org,
    "id" : squirrelDeviceID,
    "type" : "raspberrypi",
    "auth-method" : "token",
    "auth-token" : squirrelDeviceToken
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
var allHouses = [{"name":"alerts","quakeAlert":false, "possibleQuakeAlert":false, "humidityAlert":false, "motionAlert": false, "rainAlert":false},
                 {"name":"snowy", "deviceId":snowyDeviceID, "quakePayload":{}, "motionPayload":{}, "humiturePayload":{}, "myQuakeMagnitude":0},
                 {"name":"hhbear", "deviceId":hhbearDeviceID, "quakePayload":{}, "motionPayload":{}, "myQuakeMagnitude":0},
                 {"name":"squirrel","deviceId":squirrelDeviceID,"humiturePayload":{},"rainPayload":{}, "myQuakeMagnitude":0},
                 {"name":"snail","deviceId":snailDeviceID,"quakePayload":{},"motionPayload":{}, "myQuakeMagnitude":0}
                 ];
allHouses.isQuake = false;

appClient.on("deviceEvent", function(deviceType, deviceId, eventType, format,payload){
  // temp total quake magnitude
  var totalQuakeMag = 0;
  var nbrOfDevices = 0;
  allHouses.forEach(function(myHouse) {
    if (myHouse.deviceId === deviceId) {
      if ( eventType === 'quakeSensor' ){
        myHouse.quakePayload = JSON.parse(JSON.parse(payload));
        myHouse.myQuakeMagnitude = Math.abs(myHouse.quakePayload.gyroScaledZ) + Math.abs(myHouse.quakePayload.gyroScaledY) + Math.abs(myHouse.quakePayload.gyroScaledX);   
        if (myHouse.myQuakeMagnitude > 40) {
          allHouses[0].possibleQuakeAlert = true;
        }
      } 
      else if (eventType === 'motionSensor'){
        myHouse.motionPayload = JSON.parse(payload);
      }
      else if (eventType ==='humitureSensor'){
    	myHouse.humiturePayload = JSON.parse(payload);
    	//console.log('The humiture sensor data is'+JSON.parse(payload));
      }
      else if (eventType ==='rainSensor'){
    	myHouse.rainPayload = JSON.parse(payload);   
    	console.log('The rain sensor data is'+JSON.parse(payload));
      }
      else {
        //console.log('Got other events of ' + eventType + ' from ' + deviceId + ':' + JSON.stringify(payload));
      } 
    }
    // aggregate temp total quake magnitude 
    if (myHouse.myQuakeMagnitude !== undefined && myHouse.myQuakeMagnitude > 5){
      nbrOfDevices = nbrOfDevices + 1;
      totalQuakeMag = totalQuakeMag + myHouse.myQuakeMagnitude;
    }
  });
  // calc avg quakeMagnitude and if above threshold, send alert
  if (nbrOfDevices !== 0) {
	  var avgQuakeMag = totalQuakeMag / nbrOfDevices;
      console.log("Quake data: avg - " +  avgQuakeMag +" total - " + totalQuakeMag + " nbrdevices - " + nbrOfDevices);
	  if ((avgQuakeMag > 40) && (nbrOfDevices > 1)) {
		if (allHouses[0].quakeAlert === false) {
			console.log("Quake data changed! Quake detected! Data: avg - " +  avgQuakeMag +" total - " + totalQuakeMag + " nbrdevices - " + nbrOfDevices);
		}
	    allHouses[0].quakeAlert = true;
	  } else {
		if (allHouses[0].quakeAlert === true) {
			console.log("Quake data changed! No quaking at the moment");
		}
		allHouses[0].quakeAlert = false;
	  }  
  }
  
});

app.post('/message', twilioServer.sendMessage(twilio, twilioSid, twilioToken));
app.get('/sensordata', raspberryPiServer.returnCurrentSensorData(allHouses));
app.get('/sendQuakeAlert', raspberryPiServer.sendQuakeAlert(appClient, snowyDeviceID));

// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function() {
	// print a message when the server starts listening
  console.log("server starting on " + appEnv.url);
});
