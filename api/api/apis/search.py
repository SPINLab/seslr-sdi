# -*- coding: utf-8 -*-
"""

@author: Chris Lucas
"""

import os
import json

from flask_restplus import Namespace, Resource, fields, reqparse
from werkzeug.exceptions import NotFound
from psycopg2.extras import RealDictCursor

from core.constants import DEMO_FIND_SPOTS
from core.db import get_db


api = Namespace(
    'Search',
    description='Search the database.'
)

geometry_fields = api.model('geometry', {
    'type': fields.String(),
    'coordinates': fields.List(fields.Float),
})
geometry_nested = fields.Nested(geometry_fields)
geometry_wildcard = fields.Wildcard(geometry_nested)

search_result = api.model('Search Result', {
    'find_spot_id': fields.Integer(description='The ID of the find spot.'),
    'geometry': geometry_wildcard,
    'shortend_description': fields.String(description='A shortend description of the find spot.')
})

parser = reqparse.RequestParser()
parser.add_argument('query', type=str, help='The search query.')


@api.route('/')
class Search(Resource):

    @api.expect(parser)
    @api.marshal_with(search_result)
    def get(self):
        """
        List all find spots in database with a match with the search query, ranked by computed relevancy.
        """

        args = parser.parse_args()

        db = get_db()
        cursor = db.cursor(cursor_factory=RealDictCursor)

        search_query = args.query.strip()

        find_spot_match = None
        if search_query.isdecimal():
            query = """
            SELECT fs."find_spot_ID" find_spot_id,
                   ST_AsGeoJSON(fsp.geom) geometry,
                   LEFT(fs.description, 50) shortend_description
            FROM seslr.find_spot fs JOIN seslr.find_spot_points fsp ON fs."find_spot_ID" = fsp.find_spot_id
            WHERE fs."find_spot_ID" = %(search_query)s
            """

            cursor.execute(query, {'search_query': search_query})
            find_spot_match = cursor.fetchone()

        query = """
        WITH search_results AS (
        SELECT fs.find_spot_id,
                ts_rank(fs.description_tokens, websearch_to_tsquery(%(search_query)s)) AS rank1,
                ts_rank(fs.type_tokens, websearch_to_tsquery(%(search_query)s)) AS rank2,
                ts_rank(fs.toponym_tokens, websearch_to_tsquery(%(search_query)s)) AS rank3,
                ts_rank(f.description_tokens, websearch_to_tsquery(%(search_query)s)) AS rank4,
                ts_rank(f.features_tokens, websearch_to_tsquery(%(search_query)s)) AS rank5,
                ts_rank(f.features_architecture_tokens, websearch_to_tsquery(%(search_query)s)) AS rank6
                FROM seslr.find_spot_search_vectors fs JOIN seslr.find_search_vectors f ON fs.find_spot_id = f.find_spot_id
                WHERE fs.description_tokens @@ websearch_to_tsquery(%(search_query)s)
                OR fs.type_tokens @@ websearch_to_tsquery(%(search_query)s)
                OR fs.toponym_tokens @@ websearch_to_tsquery(%(search_query)s)
                OR f.description_tokens @@ websearch_to_tsquery(%(search_query)s)
                OR f.features_tokens @@ websearch_to_tsquery(%(search_query)s)
                OR f.features_architecture_tokens @@ websearch_to_tsquery(%(search_query)s)
        )
        SELECT sr.find_spot_id,
               ST_AsGeoJSON(fsp.geom) geometry,
               LEFT(fs.description, 50) shortend_description,
               coalesce(sr.rank1, 0) + coalesce(sr.rank2, 0) + coalesce(sr.rank3, 0) + coalesce(sr.rank4, 0) + coalesce(sr.rank5, 0) + coalesce(sr.rank6, 0) AS rank
        FROM search_results sr JOIN seslr.find_spot fs ON sr.find_spot_id = fs."find_spot_ID" JOIN seslr.find_spot_points fsp ON sr.find_spot_id = fsp.find_spot_id
        ORDER BY rank DESC
        """

        cursor.execute(query, {'search_query': search_query})
        results = cursor.fetchall()

        cursor.close()

        if results is None and find_spot_match is None:
            raise NotFound('No matches found in database.')
        else:
            if find_spot_match is not None:
                results.insert(0, find_spot_match)
            if os.environ['SESLR_APP_MODE'] == 'demo':
                results = [r for r in results if r['find_spot_id'] in DEMO_FIND_SPOTS]
            for r in results:
                r['geometry'] = json.loads(r['geometry'])
            return results
