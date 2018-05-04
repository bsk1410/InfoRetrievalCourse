import tweepy
import json
import sys
import requests

# query processing metadata
q0 = 'american flag debate ronald reagan'
is_user_id = False  # default centroid = 0, but will not be used for use_id = False
screen_name = '@RickSantorum'
is_spanish = False

with open("creds.json", "r") as file:  
    creds = json.load(file)

if is_user_id:
    with open("creds.json", "r") as file:  
        credentials = json.load(file)
    CONSUMER_KEY = credentials["CONSUMER_KEY"]
    CONSUMER_SECRET = credentials["CONSUMER_SECRET"]
    OAUTH_TOKEN = credentials["OAUTH_TOKEN"]
    OAUTH_TOKEN_SECRET = credentials["OAUTH_TOKEN_SECRET"]
    auth = tweepy.OAuthHandler(CONSUMER_KEY, CONSUMER_SECRET)
    auth.set_access_token(OAUTH_TOKEN, OAUTH_TOKEN_SECRET)
    api = tweepy.API(auth)


# query boosting weights
w_tf = 0.7     # tweet text field weighting
w_cf = 0.3     # tweet copy field weighting
w_id0 = 0.7      # tweet source weighting for 1st degree follows
w_id1 = 0.3    # mention or response weighting for 1st degree follows
w_idn = 2      # twitter id weighting normalization = centroid / 1st degree follows weighting


def replace_entities(q):
    for i in entity_map:
        for entity in entity_map[i]:
            if entity in q.lower():
                q = q.replace(entity,replace_map[i])
                break
    return q


def apply_boosts(q):
    eng_boost = ('qf=text_eng^' + str(w_tf) + ' ')*(not is_spanish)
    esp_boost = ('qf=text_esp^' + str(w_tf) + ' ')*is_spanish
    id_boost = ('qf=user_id^' + str(w_id0) + ' qf=entities_user_mentions^' + str(w_id1) + \
                ' qf=in_reply_to_user_id^' + str(w_id1) + ' ')*is_user_id
    return '{' + eng_boost + esp_boost + id_boost + 'qf=_text_^' + str(w_cf) + '}' + q

def system_code(q):
    q = '"http://localhost:8983/solr/tweet_store/select?q=' + \
                q.replace(' ','%20').replace('"','%22') + '"'
    return q

def idq_add(s, centroid, id_list):
    flds = ['user_id','entities_user_mentions','in_reply_to_user_id']
    for f in flds:
        if centroid !=0:
            s += ' ' + str(f) + ':' + str(centroid[0]) + '^' + str(w_idn) + ' '
            for elem in id_list[:20]:
                s += str(f) + ':' + str(elem) + ' '
        else:
            s += ' ' + str(f) + ':' + '^' + str(w_idn) + ' '
            for elem in id_list[:20]:
                s += str(f) + ':' + str(elem) + ' '
    return s[:-1]


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

q = replace_entities(q0)
q = apply_boosts(q)


if is_user_id:
    centroid = [api.get_user(screen_name)._json['id']]
    one_d_links = api.friends_ids(screen_name)
else:
    centriod = 0
    one_d_links = []

q = idq_add(q, centroid, one_d_links)

q_sys = system_code(q)

r = requests.get(q_sys)
print(r.json())