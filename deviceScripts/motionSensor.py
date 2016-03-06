# Only run on the raspberry pi
import RPi.GPIO as GPIO
import time
import os

# Motion sensor
sensor = 4

GPIO.setmode(GPIO.BCM)
GPIO.setup(sensor, GPIO.IN, GPIO.PUD_DOWN)

def sample():
    data = {}
    currentState = GPIO.input(sensor)
    data['motionDetected'] = currentState;
    return data
