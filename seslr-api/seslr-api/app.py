# -*- coding: utf-8 -*-
"""

@author: Chris Lucas
"""

from flask import Flask, render_template
from flask_restplus import Api
# from werkzeug.contrib.fixers import ProxyFix

from apis import find_spots, periods
from core import db


app = Flask(__name__)
# app.wsgi_app = ProxyFix(app.wsgi_app)
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
api.namespaces.pop(0)

db.init_app(app)
