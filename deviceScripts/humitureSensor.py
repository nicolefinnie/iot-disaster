#!/usr/bin/python
import sys
import Adafruit_DHT

# Routine to return the humiture data from DHT sensor
def humiture():
    data = {}
    humidity, temperature = Adafruit_DHT.read_retry(11, 4)
    data['temp']=temperature
    data['humid']=humidity
    if humidity is not None and temperature is not None:
       print 'Temp={0:0.1f}*C  Humidity={1:0.1f}%'.format(temperature, humidity)	
    else:
       print 'Failed to get reading. Try again!'
    return data 
