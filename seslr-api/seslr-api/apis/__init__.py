# -*- coding: utf-8 -*-
"""

@author: Chris Lucas
"""

from flask_restplus import Api

from .findspots import api as find_spots
from .finds import api as finds
from .periods import api as periods


api = Api(
    title='SESLR Data API',
    version='1.0',
    description='The data API for the SESLR project.',
)

api.add_namespace(find_spots, path='/find_spots')
api.add_namespace(finds, path='/finds')
api.add_namespace(periods, path='/periods')
