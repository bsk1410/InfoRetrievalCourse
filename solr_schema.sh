bin/solr create -c tweet_store -s 1 -rf 1
curl -X POST -H 'Content-type:application/json' --data-binary '{
  "add-field":{
     "name":"user_verified",
     "type":"boolean",
     "indexed":"true",
     "stored":"true" }
  "add-field":{
     "name":"user_location",
     "type":"text_general",
     "indexed":"true",
     "stored":"true" }
  "add-field":{
     "name":"entities_hashtags",
     "type":"text_general",
     "indexed":"true",
     "stored":"true"
     "multiValued":"true" }
  "add-field":{
     "name":"entities_user_mentions",
     "type":"pint",
     "indexed":"true",
     "stored":"true"
     "multiValued":"true" }
  "add-field":{
     "name":"text",
     "type":"text_general",
     "indexed":"true",
     "stored":"true" }
  "add-field":{
     "name":"geo",
     "type":"boolean",
     "indexed":"true",
     "stored":"true" }
  "add-field":{
     "name":"created_at",
     "type":"pdate",
     "indexed":"true",
     "stored":"true" }
  "add-field":{
     "name":"in_reply_to_status_id",
     "type":"pint",
     "indexed":"true",
     "stored":"true" }
  "add-field":{
     "name":"in_reply_to_user_id",
     "type":"pint",
     "indexed":"true",
     "stored":"true" }
  "add-field":{
     "name":"coordinates",
     "type":"location",
     "indexed":"true",
     "stored":"true"
     "multiValued":"true" }
  "add-field":{
     "name":"place",
     "type":"text_general",
     "indexed":"true",
     "stored":"true" }
  "add-field":{
     "name":"favorite_count",
     "type":"pint",
     "indexed":"true",
     "stored":"true" }
  "add-field":{
     "name":"retweet_count",
     "type":"pint",
     "indexed":"true",
     "stored":"true" }
  "add-field":{
     "name":"lang",
     "type":"string",
     "indexed":"true",
     "stored":"true" }
  "add-field":{
     "name":"user_id",
     "type":"pint",
     "indexed":"true",
     "stored":"true" }
  "add-field":{
     "name":"user_name",
     "type":"text_general",
     "indexed":"true",
     "stored":"true" }
  "add-field":{
     "name":"user_screen_name",
     "type":"text_general",
     "indexed":"true",
     "stored":"true" }
  "add-field":{
     "name":"user_description",
     "type":"text_general",
     "indexed":"true",
     "stored":"true" }
  "add-field":{
     "name":"user_followers_count",
     "type":"pint",
     "indexed":"true",
     "stored":"true" }
  "add-field":{
     "name":"user_friends_count",
     "type":"pint",
     "indexed":"true",
     "stored":"true" }
  "add-field":{
     "name":"user_lang",
     "type":"string",
     "indexed":"true",
     "stored":"true" }
  "add-copy-field":{
     "source":"user_location",
     "dest":"_text_"}     
  "add-copy-field":{
     "source":"entities_hashtags",
     "dest":"_text_"}     
  "add-copy-field":{
     "source":"text",
     "dest":"_text_"}     
  "add-copy-field":{
     "source":"place",
     "dest":"_text_"}     
  "add-copy-field":{
     "source":"user_name",
     "dest":"_text_"}     
  "add-copy-field":{
     "source":"user_screen_name",
     "dest":"_text_"}     
  "add-copy-field":{
     "source":"user_description",
     "dest":"_text_"}
 }' http://localhost:8983/solr/tweet_store/schema
