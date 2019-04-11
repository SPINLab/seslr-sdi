# -*- coding: utf-8 -*-
"""

@author: Chris Lucas
"""

import psycopg2
from flask_restplus import Namespace, Resource, fields

from core.db import get_db


api = Namespace('Periods', description='Get the find spots by period')

periods = api.model('Periods', {
    'periods': fields.List(fields.String(), description="All periods found in the database.")
})

period = api.model('Period', {
    "spot_ids": fields.List(fields.String(), description="All find spot ids from the period.")
})


@api.route('/')
class Periods(Resource):

    @api.marshal_with(periods)
    def get(self):
        """Get all valid periods"""

        db = get_db()
        cursor = db.cursor()

        query = 'SELECT column_name FROM information_schema.columns WHERE table_schema = "seslr" AND table_name = "find_spot_chronology" AND column_name != "find_spot_ID" AND column_name != "based_on";'

        cursor.execute(query)
        results = cursor.fetchall()
        cursor.close()

        if results is None:
            return { 'message' : 'No periods found in database.'}, 404
        else:
            results = [result[0] for result in results]
            return {
                "periods": results
            }


@api.route('/<string:period>')
class Period(Resource):

    @api.doc(params={"period": "The period of the find spots"})
    @api.marshal_with(period)
    def get(self, period):
        """Get all find spot ids for a certain period"""

        db = get_db()
        cursor = db.cursor()

        query = 'SELECT "find_spot_ID" FROM seslr.find_spot_chronology WHERE {} = true;'.format(psycopg2.extensions.quote_ident(period, db))

        cursor.execute(query)
        results = cursor.fetchall()
        cursor.close()

        if results is None:
            return { 'message' : 'No spots found for period: {}'.format(period) }, 404
        else:
            results = [result[0] for result in results]
            return {
                "spot_ids": results
            }
