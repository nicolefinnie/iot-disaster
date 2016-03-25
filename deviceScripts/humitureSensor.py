#!/usr/bin/env python
# This is only run on Raspberry pi
import Adafruit_DHT as DHT
import RPi.GPIO as GPIO

# model DHT11
DHTModel = 11
# GPIO pin
gpioPort = 0

def setup(inputPort):
    global gpioPort
    gpioPort = inputPort
    GPIO.setmode(GPIO.BCM)
    GPIO.setup(gpioPort, GPIO.IN)
    
def sample():
    global gpioPort
    data = {}
    humidity, temperature = DHT.read_retry(DHTModel, gpioPort)
    currentState = GPIO.input(gpioPort)
    data['temp'] = temperature
    data['humid'] = humidity
    return data
