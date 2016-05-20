#!/usr/bin/env python
import PCF8591 as ADC
import RPi.GPIO as GPIO
import time
import math

initialRainIntensityReading = 0
lowerBoundary = 0
# configure the delta here
rainDelta = 2

def setup(gpioPort, i2cAddress):
        global initialRainIntensityReading
        global lowerBoundary
        GPIO.setmode(GPIO.BCM)
        ADC.setup(i2cAddress)
        GPIO.setup(gpioPort, GPIO.IN)
        initialRainIntensityReading = ADC.read(0)
        # set the delta zone so we dont need to recalc it every time
        lowerBoundary = initialRainIntensityReading - rainDelta
        print "initial rain intensity reading: ", initialRainIntensityReading

def sample():
        currentRainIntensity = ADC.read(0)
        data = {}
        data['rainReading'] = currentRainIntensity
        # if any rain drop is detected
        if (lowerBoundary > currentRainIntensity) :
                data['rainDetected'] = True;
        else:
                data['rainDetected'] = False;

        return data;
    