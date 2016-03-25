#!/usr/bin/python
# Only run on the raspberry pi
import RPi.GPIO as GPIO

gpioPort = 0

def setup(inputPort):
    global gpioPort
    gpioPort = inputPort
    GPIO.setmode(GPIO.BCM)
    GPIO.setup(gpioPort, GPIO.IN, GPIO.PUD_DOWN)

def sample():
    global gpioPort
    data = {}
    currentState = GPIO.input(gpioPort)
    data['motionDetected'] = currentState
    return data
