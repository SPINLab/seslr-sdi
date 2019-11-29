# -*- coding: utf-8 -*-
"""

@author: Chris Lucas
"""

import os
import re

from flask_restplus import Namespace, Resource, fields, reqparse
from werkzeug.exceptions import NotFound

from core.constants import DEMO_FIND_SPOTS
from core.db import get_db


api = Namespace(
    'Search',
    description='Search the database.'
)

find_spots = api.model('Find Spots', {
    'find_spot_ids': fields.List(
        fields.Integer(),
        description='All find spot ids found in the database.'
    )
})

parser = reqparse.RequestParser()
parser.add_argument('query', type=str, help='The search query.')


@api.route('/')
class Search(Resource):

    @api.expect(parser)
    @api.marshal_with(find_spots)
    def get(self):
        """
        List all find spots in database with a match with the search query
        """

        args = parser.parse_args()
        query = args.query
        query = re.sub(r'[ \t]+', ' & ', query)

        db = get_db()
        cursor = db.cursor()

        find_spot_query = """
        SELECT find_spot_id FROM seslr.find_spot_search_vectors
        WHERE description_tokens @@ to_tsquery(%s)
            OR type_tokens @@ to_tsquery(%s)
            OR toponym_tokens @@ to_tsquery(%s);
        """

        cursor.execute(find_spot_query, (query, query, query))
        find_spot_results = cursor.fetchall()

        find_query = """
        SELECT find_spot_id FROM seslr.find_search_vectors
        WHERE description_tokens @@ to_tsquery(%s)
            OR features_tokens @@ to_tsquery(%s)
            OR features_architecture_tokens @@ to_tsquery(%s);
        """

        cursor.execute(find_query, (query, query, query))
        find_results = cursor.fetchall()
        cursor.close()

        if find_spot_results is None and find_results is None:
            raise NotFound('No matches found in database.')
        else:
            find_spot_results = [int(r[0]) for r in find_spot_results]
            find_results = [int(r[0]) for r in find_results]
            results = list(set(find_spot_results + find_results))
            if os.environ['SESLR_APP_MODE'] == 'demo':
                results = [r for r in results if r in DEMO_FIND_SPOTS]
            return {'find_spot_ids': results}
