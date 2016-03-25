#!/usr/bin/python
# Only run on the raspberry pi
import rainSensor
import json
import time

gpioPort = 7
i2cAddress = 0x48
rainSensor.setup(gpioPort, i2cAddress)

while True:
    time.sleep(0.5)
    try:
        rainData = rainSensor.sample()
        jsonData = json.dumps(rainData)
        print "Current rain sensor data:", jsonData
    except Exception as e:
        print "Uh oh, exception!", e

