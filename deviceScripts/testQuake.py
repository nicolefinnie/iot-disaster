#!/usr/bin/python
# Only run on the raspberry pi
import quakeSensor
import json
import time

while True:
    time.sleep(2)
    try:
        quakeData = quakeSensor.sample()
        jsonData = json.dumps(quakeData)
        print "Current sensor data:", jsonData
        isQuake = quakeSensor.isPossibleQuake(quakeData)
        if isQuake:
            print "WATCH OUT!!!!"
        else:
            print "All is calm, carry on."
    except Exception as e:
        print "Uh oh, exception!", e
