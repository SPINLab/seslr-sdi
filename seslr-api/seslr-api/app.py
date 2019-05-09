# -*- coding: utf-8 -*-
"""

@author: Chris Lucas
"""

import os

from flask import Flask, render_template
from flask_restplus import Api

from apis import find_spots, periods, photos
from core import db


app = Flask(__name__)
app.config['SWAGGER_UI_DOC_EXPANSION'] = 'list'
app.config['RESTPLUS_VALIDATE'] = True
app.config['RESTPLUS_MASK_SWAGGER'] = False


@app.route('/')
def documentation():
    return render_template('documentation.html')


api = Api(
    app,
    title='SESLR Data API',
    version='1.0',
    description='The data API for the SESLR project.',
)

api.add_namespace(find_spots, path='/find_spots')
api.add_namespace(periods, path='/periods')
if os.environ['SESLR_APP_MODE'] != 'demo':
    api.add_namespace(photos, path='/photos')
api.namespaces.pop(0)

db.init_app(app)
