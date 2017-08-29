import requests
from requests import Request,Session
import json

b_url = "http://yourodooserver.com"
# or "http://201.100.100.12:8069" (or whatever the ip is)
url = "{}/web/session/authenticate".format(b_url)

db = "<YOURDBNAME>"
user = "<YOURUSERNAME>"
passwd = "<YOURPASSWORD>"

s = Session()

data = {
    'jsonrpc':'2.0',
    'params': {
        'context': {},
        'db': db,
        'login': user,
        'password': passwd,
    },
}

headers = {
    'Content-type': 'application/json'
}

req = Request('POST',url,data=json.dumps(data),headers=headers)

prepped = req.prepare()

resp = s.send(prepped)

session_id = json.loads(resp.text)['result']['session_id']

# NOW MAKE REQUESTS AND PASS YOUR SESSION ID

res = requests.get(b_url + "/your/controller/path",cookies={'session_id':str(session_id)})

print(res.text)