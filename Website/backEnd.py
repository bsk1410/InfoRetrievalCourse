import json
import tweepy
from flask import Flask, jsonify
from flask import send_from_directory
import requests

isUserId = False;
screenName = False;

wTf = 0.7;
wCf = 0.3;
wId0 = 0.7;
wId1 = 0.3;
wIdn = 2;

f_name = 'entity_lookup.txt'
f = open(f_name)
entity_map = {}
replace_map = {}
for i,line in enumerate(f):
    line_s = line.split(':')
    entities = line_s[0].split(',')
    replacement = line_s[1][:-1]
    entity_map[i] = entities
    replace_map[i] = replacement
    
def replace_entities(q):
    for i in entity_map:
        for entity in entity_map[i]:
            if entity in q.lower():
                q = q.replace(entity,replace_map[i])
                break
    return q        

isSpanish = 0
def applyBoosts(q):
    engBoost = ('qf=text_eng^'+str(wTf)+' ')
    return '{'+engBoost+'qf=_text_^'+str(wCf)+q

def systemCode(q):
    queryURL = "http://localhost:8983/solr/tweet_store/select?q="
    q = queryURL+q.replace(' ','%20').replace('"','%22')+'&rows=10'+'&wt=json'
    return q

app = Flask(__name__)
@app.route('/<query>')
def getSolrResponse(query):
    query+= query.replace(' ','%20')
    q = replace_entities(query)
    q = systemCode(q)
    r = requests.get(q)
    r = r.json()
    t = r['response']['docs']

    htmTags = []
    for tweets in t:
        urlString = '<blockquote class="twitter-tweet"><p lang="en" dir="ltr">'
            #hashes = findHash(t['text_eng'],'#')
        txt = ''.join([x for x in tweets['text_eng'] if x not in ('\\', '\n')])
        txt = ' '.join(txt.split())
        unm = ''.join([x for x in tweets['user_name'] if x not in ('\\', '\n')])
        unm = ' '.join(unm.split())
        usnm = ''.join([x for x in tweets['user_screen_name'][0] if x not in ('\\', '\n')])
        usnm = ' '.join(usnm.split())
        urlString+=str(txt)+'</p>&mdash;'+str(unm)+'@'+str(usnm)+'</blockquote>'
        htmTags.append(urlString)  
    htmlDict = {'docs':htmTags}
    return jsonify(htmlDict)

@app.route('/favicon.ico') 
def favicon(): 
    return send_from_directory(os.path.join(app.root_path, 'static'), 'favicon.ico', mimetype='image/vnd.microsoft.icon')

if __name__ == "__main__":
    app.run(debug=True)