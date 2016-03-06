# This is only executed on the device client e.g. Raspberry Pi
import time
import os, json
import ibmiotf.application
import uuid
import quakeSensor
import motionSensor

client = None

def myEarthquakeAlert(cmd):
    if cmd.event == "earthquake":
        payload = json.loads(cmd.payload)
        command = payload["command"]
        print command
        if command == "alert":
            os.system('mpg321 -n 1000 music/imperialMarch.mp3')

try:
    options = ibmiotf.application.ParseConfigFile("/home/pi/device.cfg")
    options["deviceId"] = options["id"]
    options["id"] = "aaa" + options["id"]
    client = ibmiotf.application.Client(options)
    client.connect()
    client.deviceEventCallback = myEarthquakeAlert
    client.subscribeToDeviceEvents(event="earthquake")

    quakeStatus = False
    motionStatus = False
    while True:
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
    