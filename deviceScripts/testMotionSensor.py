#!/usr/bin/python
# Only run on the raspberry pi
import motionSensor
import json
import time

gpioPort = 4
motionSensor.setup(gpioPort)

while True:
    time.sleep(0.5)
    try:
        motionData = motionSensor.sample()
        jsonData = json.dumps(motionData)
        print "Current motion sensor data:", jsonData
    except Exception as e:
        print "Uh oh, exception!", e

