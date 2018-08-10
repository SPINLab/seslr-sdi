# -*- coding: utf-8 -*-
"""

@author: Chris Lucas
"""

from flask import Flask

from apis import api


app = Flask(__name__)
app.config['SWAGGER_UI_DOC_EXPANSION'] = 'list'
app.config['RESTPLUS_VALIDATE'] = True
app.config['RESTPLUS_MASK_SWAGGER'] = False

api.init_app(app)
api.namespaces.pop(0)
