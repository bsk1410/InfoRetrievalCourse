import json
import tweepy
from flask import Flask, jsonify
from flask import send_from_directory
import requests
import sys


w_tf = 2       # tweet text field weighting
w_id0 = 0.7    # weighting for centroid tweets
w_id1 = 0.3    # mention of or response to centroid or tweet by 1st degree follows
w_id2 = 2      # mention of or response to 1st degree follows
w_a2 = 2       # additional score for high attention tweets
w_a1 = 1 

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
    q = q.lower()
    for i in entity_map:
        for entity in entity_map[i]:
            if entity in q.lower():
                q = q.replace(entity,replace_map[i])
                break
    return q        

def apply_boosts(q, is_spanish):
    eng_boost = ('text_eng:{' + q + '}^' + str(w_tf))*(not is_spanish)
    esp_boost = ('text_esp:{' + q + '}^' + str(w_tf))*is_spanish
    return eng_boost + esp_boost + ' _text_:{' + q + '}' + \
               ' attn_score:2^' + str(w_a2) + ' attn_score:1^' + str(w_a1)

def idq_add(field, id_list, w):
    s = ''
    for f in field:
        for elem in id_list:
            s += f + ':' + str(elem) + '^' + str(w) + ' '
    s[:-1]
    return s

def systemCode(q):
    q = '"http://localhost:8983/solr/tweet_store_es_attn/select?q=' + \
                q.replace(' ','%20').replace('"','%22') + '"'
    return q

app = Flask(__name__)
@app.route('/<query>')
def getSolrResponse(query):
    import sys, os
    pv = query.split('_')
    query = pv[0]
    is_spanish = int(pv[1])
    screen_name= pv[2]
    is_user_id = screen_name.startswith('@')
    if is_user_id:
        sys.path.insert(0,'../')
        from data import credentials
        CONSUMER_KEY = credentials.CONSUMER_KEY
        CONSUMER_SECRET = credentials.CONSUMER_SECRET
        OAUTH_TOKEN = credentials.OAUTH_TOKEN
        OAUTH_TOKEN_SECRET = credentials.OAUTH_TOKEN_SECRET
        auth = tweepy.OAuthHandler(CONSUMER_KEY, CONSUMER_SECRET)
        auth.set_access_token(OAUTH_TOKEN, OAUTH_TOKEN_SECRET)
        api = tweepy.API(auth)
    query = query.replace(' ','%20')
    q = replace_entities(query)
    q = apply_boosts(q, is_spanish)
    r = ''
    if is_user_id:
        centroid = [api.get_user(screen_name)._json['id']]
        one_d_links = api.friends_ids(screen_name)
        r += idq_add(['user_id'],centroid,w_id0)
        r += idq_add(['entities_user_mentions','in_reply_to_user_id'],centroid,w_id1)
        r += idq_add(['user_id'],one_d_links[:20],w_id1)
        r += idq_add(['entities_user_mentions','in_reply_to_user_id'],one_d_links[:20],w_id2)
    else:
        centriod = None
        one_d_links = []
    q = systemCode(q+r)
    cmd = 'curl "'+q+'" > "q_response.txt"'
    #print(cmd)
    #call(["curl","q",">","q_response.txt"])
    os.system(cmd)
    r = open("q_response.txt").read()
    r = json.loads(r)
    t = r['response']['docs']

    htmTags = []
    for tweets in t:
        urlString = '<blockquote class="twitter-tweet"><p lang="en" dir="ltr">'
        if tweets['lang'] == 'es':
            txt = tweets['text_esp']
        else:
            txt = tweets['text_eng']
        txt = ''.join([x for x in txt if x not in ('\\', '\n')])
        txt = ' '.join(txt.split())
        clr1 = clr2 = clr3 = '#122B69'
        t = txt.split()
        for i,w in enumerate(t):
            if w.startswith('http'):
                t[i] = '<span>' + w + '</span>'
            elif w.startswith('@'):
                t[i] = '<span>' + w + '</span>'        
            elif w.startswith('#'):
                t[i] = '<span>' + w + '</span>'
        txt = ' '.join(t)        
        unm = ''.join([x for x in tweets['user_name'] if x not in ('\\', '\n')])
        unm = ' '.join(unm.split())
        usnm = ''.join([x for x in tweets['user_screen_name'][0] if x not in ('\\', '\n')])
        usnm = ' '.join(usnm.split())
        urlString+=str(txt)+'</p>&mdash;'+str(unm)+'@'+str(usnm)+'<p>   Favorites Count: '+str(tweets['favorite_count'])+'  Retweets Count: '+str(tweets['retweet_count'])+'</p>'+'</blockquote>'
        htmTags.append('<pre>'+urlString+'</pre>')
    htmlDict = {'docs' : htmTags}  
    return jsonify(htmlDict)
    #return str(q)

@app.route('/favicon.ico') 
def favicon(): 
    return send_from_directory(os.path.join(app.root_path, 'static'), 'favicon.ico', mimetype='image/vnd.microsoft.icon')

if __name__ == "__main__":
    app.run(debug=True)