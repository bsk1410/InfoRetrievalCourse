from flask import Flask, jsonify
import requests
import os 
from flask import send_from_directory     

app = Flask(__name__)

@app.route('/<query>')
def getSolrResponse(query):
	q = 'http://localhost:8983/solr/tweet_store/select?q='
	q+= query.replace(' ','%20')
	r = requests.get(q)
	return jsonify(r.json())

@app.route('/')
def hello():
	return "hello_world!"

@app.route('/favicon.ico') 
def favicon(): 
    return send_from_directory(os.path.join(app.root_path, 'static'), 'favicon.ico', mimetype='image/vnd.microsoft.icon')

if __name__ == "__main__":
	app.run(debug=True)