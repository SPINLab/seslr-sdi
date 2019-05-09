# -*- coding: utf-8 -*-
"""

@author: Chris Lucas
"""

import os
from flask import json
from app import app, api

OUTPUT = 'static/swagger.json'

mode = os.environ['SESLR_APP_MODE']
mode = '/' + mode if mode != 'prod' else ''
base_path = '{}/api/'.format(mode)

os.makedirs(os.path.dirname(OUTPUT), exist_ok=True)

with app.test_request_context():
    swagger = api.__schema__
    swagger['basePath'] = base_path
    with open(OUTPUT, 'w') as f:
        f.write(json.dumps(swagger, sort_keys=True, indent=4, separators=(',', ': ')))
