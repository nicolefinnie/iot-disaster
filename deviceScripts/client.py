# This is only executed on the device client e.g. Raspberry Pi
import time
import os, json
import ibmiotf.application
import uuid
import quakeSensor

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
    while True:
        quakeData = quakeSensor.sample()
        jsonQuakeData = json.dumps(quakeData)
        client.publishEvent("raspberrypi", options["deviceId"], "quakeSensor", "json", jsonQuakeData)
        if quakeSensor.isPossibleQuake(quakeData):
            quakeDetected = {'quakeDetected' : True}
            client.publishEvent("raspberrypi", options["deviceId"], "quakeDetector", "json", quakeDetected)
            if quakeStatus == False:
                print "WATCH OUT!!!!"
                quakeStatus = True
        elif quakeStatus == True:
            print "All is calm, carry on."
            quakeStatus = False
        time.sleep(0.5)
 
except ibmiotf.ConnectionException  as e:
    print e

