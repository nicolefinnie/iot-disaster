#!/usr/bin/env python
import PCF8591 as ADC
import RPi.GPIO as GPIO
import time
import math

initialRainIntensityReading = 0

def setup(gpioPort, i2cAddress):
        global initialRainIntensityReading
        GPIO.setmode(GPIO.BCM)
        ADC.setup(i2cAddress)
        GPIO.setup(gpioPort, GPIO.IN)
        initialRainIntensityReading = ADC.read(0)
        print "initial rain intensity reading: ", initialRainIntensityReading

def sample():
        global initialRainIntensityReading
        currentRainIntensity = ADC.read(0)
        data = {}
        # if any rain drop is detected
        if (currentRainIntensity < initialRainIntensityReading) :
                data['rainDetected'] = True;
        else:
                data['rainDetected'] = False;

        return data;
    