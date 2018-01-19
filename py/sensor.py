import json
import requests
import sys

def main(argv):
	r = requests.post('http://localhost:4000/sensor',data = {'lvl' : argv[0]})
	print r.content
	res = json.loads(r.content)
	print res['status']

if __name__ == "__main__" : 
	main(sys.argv[1:])