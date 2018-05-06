from flask import Flask, jsonify
import requests
import os 
from flask import send_from_directory     

app = Flask(__name__)
@app.route('/')
def hello():
	import requests
	#https://twitter.com/GoParks/status/794589497879044096
	r = requests.get('https://publish.twitter.com/oembed?url=https://twitter.com/GoParks/status/755192407910604800')#https%3A%2F%2Ftwitter.com%2FInterior%2Fstatus%2F507185938620219395')
	sep = "<script>"
	html = r.json()['html'].split(sep, 1)[0]	
	return html

@app.route('/favicon.ico') 
def favicon(): 
    return send_from_directory(os.path.join(app.root_path, 'static'), 'favicon.ico', mimetype='image/vnd.microsoft.icon')

if __name__ == "__main__":
	app.run(debug=True)