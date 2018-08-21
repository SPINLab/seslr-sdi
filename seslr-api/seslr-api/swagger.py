# -*- coding: utf-8 -*-
"""

@author: Chris Lucas
"""

import os
from flask import json
from app import app, api


BASE_PATH = '/api/'
OUTPUT = 'static/swagger.json'

os.makedirs(os.path.dirname(OUTPUT), exist_ok=True)

with app.test_request_context():
    swagger = api.__schema__
    swagger['basePath'] = BASE_PATH
    with open(OUTPUT, 'w') as f:
        f.write(json.dumps(swagger, sort_keys=True, indent=4, separators=(',', ': ')))
