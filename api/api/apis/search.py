# -*- coding: utf-8 -*-
"""

@author: Chris Lucas
"""

import os

from flask_restplus import Namespace, Resource, fields
from werkzeug.exceptions import NotFound

from core import DEMO_FIND_SPOTS
from core.db import get_db


api = Namespace(
    'Search',
    description='Search the database.'
)


search = api.model('Search', {
    'search_text': fields.String(description='The text to query.')
})


@api.route('/')
class Search(Resource):

    @api.marshal_with(search)
    def get(self):
        """
        List all find spots in database with a match with the search query
        """

        db = get_db()
        cursor = db.cursor()

        find_spot_query = """
        SELECT find_spot_id FROM seslr.find_spot_search_vectors
        WHERE description_tokens @@ to_tsquery(%s)
            OR type_tokens @@ to_tsquery(%s)
            OR toponym_tokens @@ to_tsquery(%s);
        """

        cursor.execute(find_spot_query, (search,))
        find_spot_results = cursor.fetchall()

        find_query = """
        SELECT find_spot_id FROM seslr.find_search_vectors
        WHERE description_tokens @@ to_tsquery(%s)
            OR features_tokens @@ to_tsquery(%s)
            OR features_architecture_tokens @@ to_tsquery(%s);
        """

        cursor.execute(find_query, (search,))
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
