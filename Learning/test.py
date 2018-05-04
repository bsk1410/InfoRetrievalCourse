import requests

r = requests.get('http://localhost:8983/solr/tweet_store/select?q=donald')
print(r.json)