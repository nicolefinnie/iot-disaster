#!/usr/bin/python
# Only run on the raspberry pi
import humitureSensor
import json
import time

gpioPort = 17
humitureSensor.setup(gpioPort)

while True:
    time.sleep(2)
    try:
        humitureData = humitureSensor.sample()
        jsonData = json.dumps(humitureData)
        print "Current sensor data:", jsonData
    except Exception as e:
        print "Uh oh, exception!", e
