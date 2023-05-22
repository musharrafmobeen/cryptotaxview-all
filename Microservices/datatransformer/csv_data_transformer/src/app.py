from cmath import e
import json
from flask import Flask, request
import pandas as pd
from dotenv import load_dotenv
load_dotenv()
from init_py import *
import os
from data_transformer import csvMapper


app = Flask(__name__)


@app.route('/', methods=['GET'])
def hello():
    return "Hello Universe"


@app.route('/', methods=['POST'])
def home():
    data = request.get_json()
    mapping = getMappingData(data['exchange'])
    result = csvMapper(data['csvData'], mapping["rowToCol"], mapping["exchange"], mapping["csvSplitIdentifier"], mapping["csvColumnMapping"], mapping["csvColumnJoinMapping"], mapping["csvFormulas"])
    result = json.dumps(result)
    # print(result)
    print(len(result))
    return result


PORT = 5004
try: 
    PORT = os.environ['PYTHON_BACKEND_PORT']
except:
    PORT = 5004
         
if __name__ == "__main__":
    app.run(port=PORT, host='0.0.0.0')