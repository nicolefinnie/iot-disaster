# This is only executed on the device client e.g. Raspberry Pi
#!/usr/bin/python
import time
import os, json
import ibmiotf.application
import uuid
import quakeSensor
import motionSensor
import humitureSensor

client = None

def myEarthquakeAlert(cmd):
    if cmd.event == "earthquake":
        payload = json.loads(cmd.payload)
        command = payload["command"]
        print command
        if command == "alert":
                if os.path.isfile('music/imperialMarch.mp3'):
                        os.system('mpg321 -n 1000 music/imperialMarch.mp3&')
                else:
                        print "Receive alerts from IoT, but no music file is found"

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

    while True:
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
        time.sleep(0.5)

except ibmiotf.ConnectionException  as e:
    print e
