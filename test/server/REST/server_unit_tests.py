from requests import get as GET
from requests import put as PUT
from requests import post as POST
from json import loads as parse
from json import dumps as json
from uuid import uuid4
import unittest

class TestGenomeDesignerREST(unittest.TestCase):

  def setUp(self):
      self.api_url = "http://0.0.0.0:3000/api/"
      self.run_url = "http://0.0.0.0:3000/exec/"
      self.foundry_url = "http://0.0.0.0:3000/foundry/"

      login = GET("http://0.0.0.0:3000/login", params={"user":"", "password":""})
      self.headers = {  "Content-type": "application/json", "sessionkey": login.json()["sessionkey"] }

  def test_invalid_session_key(self):
    headers = self.headers
    headers["sessionkey"] = "NA"
    url  = self.api_url

    block1 = {
      "metadata": {
        "authors": [],
        "version": "0.0.0",
        "tags": {}  },
      "options":[],
      "components":[],
      "rules": {},
      "notes": {}
    }

    res = POST(url + "block", data = json(block1), headers=headers)
    self.assertTrue(res.status_code==403)

  def test_block_creation(self):
    headers = self.headers
    url  = self.api_url

    block1 = {
      "metadata": {
        "authors": [],
        "version": "0.0.0",
        "tags": {}  },
      "options":[],
      "components":[],
      "rules": {},
      "notes": {},
      "sequence": {
        "url": "/some/location",
        "annotations": [
          {
            "id": str(uuid4()),
            "description" : "bla bla",
            "tags" : {},
            "sequence" : "ACGT",
            "start" : 5,
            "end" : 58,
            "strand" : "-"
          }
        ]
      }
    }

    res = POST(url + "block", data = json(block1), headers=headers)
    id1 = res.json()['id']

    self.assertTrue(res.status_code==200)
    self.assertTrue(len(id1)==36)

    block2 = {
      "metadata": {
        "authors": [],
        "version": "0.0.0",
        "tags": {}
      },
      "options":[],
      "components":[],
      "rules": {},
      "notes": {}
    }
    res = POST(url + "block", data = json(block2), headers=headers)
    id2 = res.json()['id']

    self.assertTrue(res.status_code==200)
    self.assertTrue(len(id2)==36)

    block3 = {
     "metadata": {
        "authors": [],
        "version": "0.0.0",
        "tags": {}
      },
      "components": [
        id1,
        id2
      ],
      "options":[],
      "rules": {},
      "notes": {}
    }

    block4 = {
     "metadata": {
        "authors": [],
        "version": "0.0.0",
        "tags": {}
      },
      "options": [
        id1,
        id2
      ],
      "components":[],
      "rules": {},
      "notes": {}
    }

    res = POST(url + "block", data = json(block3), headers=headers)
    id3 = res.json()['id']

    self.assertTrue(res.status_code==200)
    self.assertTrue(len(id3)==36)

    res = POST(url + "block", data = json(block4), headers=headers)
    id4 = res.json()['id']

    self.assertTrue(res.status_code==200)
    self.assertTrue(len(id4)==36)

    proj1 = {
     "metadata": {
        "authors": [],
        "version": "0.0.0",
        "tags": {}
      },
      "components": [
        id3,
        id4
      ],
      "settings": {}
    }

    res = POST(url + "project", data = json(proj1), headers=headers)
    pid1 = res.json()['id']

    self.assertTrue(res.status_code==200)
    self.assertTrue(len(pid1)==36)

    proj1["settings"] = { "SBOLv-version": "1.2.0" }

    res = PUT(url + "project/" + pid1, data = json(proj1), headers=headers)
    pid1 = res.json()['id']

    self.assertTrue(res.status_code==200)
    self.assertTrue(len(pid1)==36)

    res = GET(url + "project/" + pid1, params = {"tree":True}, headers=headers)

    self.assertTrue(res.status_code==200)

    res = res.json()

    self.assertTrue(len(res['components'])==5)
    self.assertTrue(len(res['components']['leaves'])==3)


  def test_cloning(self):
    headers = self.headers
    url  = self.api_url

    proj1 = {
     "metadata": {
        "authors": [],
        "version": "0.0.0",
        "tags": {}
      },
      "components": [
      ],
      "settings": {}
    }

    res = POST(url + "project", data = json(proj1), headers=headers)
    pid1 = res.json()['id']

    res = POST(url + "clone/" + pid1, headers=headers)
    pid2 = res.json()['id']

    res = POST(url + "clone/" + pid2, headers=headers)
    pid3 = res.json()['id']

    res = POST(url + "clone/" + pid3, headers=headers)
    pid4 = res.json()['id']

    res = GET(url + "project/" + pid4, headers=headers)

    hist = GET(url + "ancestors/" + pid4, headers=headers)
    self.assertTrue(hist.status_code==200)

    hist = hist.json()
    self.assertTrue(len(hist)==3)
    self.assertTrue(hist[0]==pid3)
    self.assertTrue(hist[1]==pid2)
    self.assertTrue(hist[2]==pid1)

    child = GET(url + "descendants/" + pid1, headers=headers)
    self.assertTrue(child.status_code==200)
    child = child.json()

    self.assertTrue(len(child)==5)
    self.assertTrue(len(child['leaves'])==1)

  def test_file_io(self):
    headers = self.headers
    url  = self.api_url

    contents = "Hello World"
    path = "myDir%2fhello.txt"

    res = POST(url + "file/" + path, data=contents, headers=headers)
    self.assertTrue(res.status_code==200)

    res = GET(url + "file/" + path, headers=headers)
    self.assertTrue(res.status_code==200)
    self.assertTrue(res.text==contents)

  def test_running_extensions(self):
    headers = self.headers
    url = self.run_url

    res = POST(self.api_url + "file/DNA", data="ACGTACGACTACGACTGACGACTACGAGCT", headers=headers)
    input1 = {"DNA":res.text}
    res = POST(url + "translate_dna_example", data = json(input1), headers=headers)
    self.assertTrue(res.status_code==200)
    self.assertTrue(list(res.json().keys())[0]=='Protein')
    self.assertTrue(res.json()["Protein"]=="TYDYD*RLRA")

    input1["Protein"] = "/api/file/myDir/Prot"
    res = POST(url + "translate_dna_example", data = json(input1), headers=headers)
    self.assertTrue(res.status_code==200)
    self.assertTrue(res.json()["Protein"]=='/api/file/myDir/Prot')

  def test_genbank_extension(self):
    headers = self.headers
    url = self.run_url

    block1 = {
      "metadata": {
        "authors": [],
        "version": "0.0.0",
        "tags": {}  },
      "options":[],
      "components":[],
      "rules": {},
      "notes": {}
    }
    res = POST(self.api_url + "block", data = json(block1), headers=headers)
    block_id = res.json()["id"]

    input1 = {
      "genbank":"extensions/compute/genbank_to_block/sequence.gb", 
      "sequence":"/api/file/block/"+block_id+"/sequence"
    }

    res = POST(url + "genbank_to_block", data = json(input1), headers=headers)
    self.assertTrue(res.status_code==200)

    res = res.json()
    self.assertTrue("block" in res)

    block = parse(res["block"])
    block["sequence"]["url"] = input1["sequence"]

    res = PUT(self.api_url + "block/" + block_id, data = json(block), headers=headers)
    self.assertTrue(res.status_code==200)

    res = GET(self.api_url + "block/" + block_id, headers=headers)
    self.assertTrue(res.status_code==200)
    self.assertTrue(res.json()["id"] == block_id)
    self.assertTrue(res.json()["sequence"]["url"] == input1["sequence"])

    res = GET(self.api_url + "file/block%2f"+block_id+"%2fsequence", headers=headers)
    self.assertTrue(res.status_code==200)
    self.assertTrue(len(res.text) > 1000)

  def test_foundry_api(self):
    headers = self.headers
    url = self.foundry_url

    res = GET(url + "inventory/ecoli", headers=headers)
    self.assertTrue(res.status_code==200)
    res = res.json()
    self.assertTrue(len(res["blocks"]) > 4000)

if __name__ == '__main__':
    unittest.main()

