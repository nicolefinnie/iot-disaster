#!/usr/bin/env python
# This is only run on Raspberry pi
import Adafruit_DHT as DHT
import RPi.GPIO as GPIO

# model DHT11
DHTModel = 11
# GPIO pin
sensor = 17
    
GPIO.setmode(GPIO.BCM)    
GPIO.setup(sensor, GPIO.IN)

def sample():
    data = {}
    humidity, temperature = DHT.read_retry(DHTModel, sensor)
    currentState = GPIO.input(sensor)
    data['temperature'] = temperature
    data['humidity'] = humidity
    return data


                  