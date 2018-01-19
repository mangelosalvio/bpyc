import RPi.GPIO as GPIO
import time
import json
import requests
import sys

def main(argv):
	print 'Starting...'

	ip = str(argv[0])

	SENSOR_1 = 0
	SENSOR_2 = 5
	SENSOR_3 = 6
	SENSOR_4 = 13
	SENSOR_5 = 19

	GPIO.setmode(GPIO.BCM)
	GPIO.setup(SENSOR_1, GPIO.IN, pull_up_down=GPIO.PUD_UP)
	GPIO.setup(SENSOR_2, GPIO.IN, pull_up_down=GPIO.PUD_UP)
	GPIO.setup(SENSOR_3, GPIO.IN, pull_up_down=GPIO.PUD_UP)
	GPIO.setup(SENSOR_4, GPIO.IN, pull_up_down=GPIO.PUD_UP)
	GPIO.setup(SENSOR_5, GPIO.IN, pull_up_down=GPIO.PUD_UP)

	level = 1
	new_level = 1

	while True:	
		if not GPIO.input(SENSOR_5) :
			new_level = 5

		if not GPIO.input(SENSOR_4) :
			new_level = 4

		if not GPIO.input(SENSOR_3) :
			new_level = 3

		if not GPIO.input(SENSOR_2) :
			new_level = 2

		if not GPIO.input(SENSOR_1) :
			new_level = 1

		if  level <> new_level   :
			url = 'http://' + ip + ':4000/sensor'
			r = requests.post(url,data = {'lvl' : new_level})
			print r.content
			res = json.loads(r.content)
			print res['status']

			level = new_level
			

		time.sleep(1)



if __name__ == "__main__" :
	main(sys.argv[1:])
