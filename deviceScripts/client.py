# This is only executed on the device client e.g. Raspberry Pi
#!/usr/bin/python
import time
import os, json
import ibmiotf.application
import uuid
import quakeSensor
import motionSensor
import humitureSensor
import rainSensor

client = None

motionSensorGPIOPort = 4
rainSensorGPIOPort = 7
humitureSensorGPIOPort = 17

accelerometerI2cAddress = 0x68
raindropI2cAddress = 0x48

def myEarthquakeAlert(cmd):
    if cmd.event == "earthquake":
        payload = json.loads(cmd.payload)
        command = payload["command"]
        print command
        if command == "alert":
		print "Receive earthquakes"
            	os.system('mpg321 -n 1000 music/imperialMarch.mp3 &')

try:
    options = ibmiotf.application.ParseConfigFile("/home/pi/device.cfg")
    options["deviceId"] = options["id"]
    options["id"] = "aaa" + options["id"]
    client = ibmiotf.application.Client(options)
    print "try to connect to IoT"
    client.connect()
    print "connect to IoT successfully"
    client.deviceEventCallback = myEarthquakeAlert
    client.subscribeToDeviceEvents(event="earthquake")

    quakeStatus = False
    motionStatus = False
    humitureStatus = False
    rainStatus = False

    quakeSensor.setup(accelerometerI2cAddress)
    motionSensor.setup(motionSensorGPIOPort)
    humitureSensor.setup(humitureSensorGPIOPort)
    rainSensor.setup(rainSensorGPIOPort, raindropI2cAddress)


    while True:
        rainData = rainSensor.sample()
        jsonRainData = json.dumps(rainData)
        client.publishEvent("raspberrypi", options["deviceId"], "rainSensor", "json", jsonRainData)
        
        humitureData = humitureSensor.sample()
        jsonHumitureData = json.dumps(humitureData)
        client.publishEvent("raspberrypi", options["deviceId"], "humitureSensor", "json", jsonHumitureData)
        
        quakeData = quakeSensor.sample()
        jsonQuakeData = json.dumps(quakeData)
        client.publishEvent("raspberrypi", options["deviceId"], "quakeSensor", "json", jsonQuakeData)

        motionData = motionSensor.sample()
        jsonMotionData = json.dumps(motionData)
        client.publishEvent("raspberrypi", options["deviceId"], "motionSensor", "json", jsonMotionData)

        if quakeSensor.isPossibleQuake(quakeData):
            	if quakeStatus == False:
                	print "WATCH OUT!!!!"
                	quakeStatus = True
        elif quakeStatus == True:
        	print "All is calm, carry on."
            	quakeStatus = False

        if motionData['motionDetected'] != motionStatus:
        	motionStatus = motionData['motionDetected']
        	print "Change in motion detector status, motionDetected is now:", motionStatus
         
        if rainData['rainDetected'] != rainStatus:
		    rainStatus = rainData['rainDetected']
		    print "Change in rain status, rainDetected is now:", rainStatus, " reading: ", rainData['rainReading']
        
        time.sleep(0.2)
 
except ibmiotf.ConnectionException  as e:
    print e
    
