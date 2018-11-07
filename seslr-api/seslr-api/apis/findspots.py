# -*- coding: utf-8 -*-
"""

@author: Chris Lucas
"""

from flask_restplus import Namespace, Resource, fields

from core.utils import connect_to_database


api = Namespace('Find Spots', description='Information on the spots where finds were found')


find_spots = api.model('Find Spots', {
    'find_spot_ids': fields.List(fields.Integer(), description="All find spot ids found in the database.")
})

find_spot = api.model('Find Spot', {
    'id': fields.Integer(description="The ID of the find spot."),
    'toponym': fields.String(description="The toponym of the find spot."),
    'type': fields.String(description="The type of the find spot."),
    'description': fields.String(description="A description of the find spot."),
    'chronology': fields.List(fields.String(), description="The chronology of the find spot.")
})


@api.route('/')
class FindSpots(Resource):

    @api.marshal_with(find_spots)
    def get(self):
        """List all find spots in database by id"""

        db = connect_to_database()
        cursor = db.cursor()

        query = 'SELECT "find_spot_ID" FROM seslr.find_spot;'

        cursor.execute(query)
        results = cursor.fetchall()
        cursor.close()
        db.close()

        if results is None:
            return { 'message' : 'No spots found in database.' }, 404
        else:
            results = [result[0] for result in results]
            return { 'find_spot_ids' : results }


@api.route('/<int:find_spot_id>')
class FindSpot(Resource):

    @api.doc(params={"find_spot_id": "The id of the find spot"})
    @api.marshal_with(find_spot, mask='toponym, type, description, chronology')
    def get(self, find_spot_id):
        """Get a find spot by a certain id"""

        db = connect_to_database()
        cursor = db.cursor()

        query = 'SELECT toponym, type2, description FROM seslr.find_spot WHERE "find_spot_ID" = %s;'

        cursor.execute(query, (find_spot_id,))
        try:
            find_spot_info = cursor.fetchone()
        except TypeError:
            find_spot_info = None

        query = """WITH coltorows AS (
	SELECT
		"find_spot_ID",
		UNNEST(ARRAY['LN', 'FN', 'N', 'EBA', 'MBA', 'LBA', 'EPG', 'MPG', 'LPG', 'PG', 'EG', 'MG', 'LG', 'G', 'EA', 'MA', 'LA', 'A', 'EC', 'MC', 'LC', 'C', 'EH', 'MH', 'LH', 'H', 'ER', 'MR', 'LR', 'R', 'EB', 'MB', 'LB', 'B', 'F', 'O', 'M', 'xPh', 'xFN', 'xN', 'xEBA', 'xMBA', 'xLBA', 'xEPG', 'xMPG', 'xLPG', 'xPG', 'xEG', 'xMG', 'xLG', 'xG', 'xEA', 'xMA', 'xLA', 'xA', 'xEC', 'xMC', 'xLC', 'xC', 'xEH', 'xMH', 'xLH', 'xH', 'xER', 'xMR', 'xLR', 'xR', 'xEB', 'xMB', 'xLB', 'xB', 'xF', 'xO', 'xM']) AS col_name,
		UNNEST(ARRAY["LN", "FN", "N", "EBA", "MBA", "LBA", "EPG", "MPG", "LPG", "PG", "EG", "MG", "LG", "G", "EA", "MA", "LA", "A", "EC", "MC", "LC", "C", "EH", "MH", "LH", "H", "ER", "MR", "LR", "R", "EB", "MB", "LB", "B", "F", "O", "M", "xPh", "xFN", "xN", "xEBA", "xMBA", "xLBA", "xEPG", "xMPG", "xLPG", "xPG", "xEG", "xMG", "xLG", "xG", "xEA", "xMA", "xLA", "xA", "xEC", "xMC", "xLC", "xC", "xEH", "xMH", "xLH", "xH", "xER", "xMR", "xLR", "xR", "xEB", "xMB", "xLB", "xB", "xF", "xO", "xM"]) AS col_value
	FROM seslr.find_spot_chronology
)
SELECT array_agg(col_name) AS true_col_names FROM coltorows WHERE col_value AND "find_spot_ID" = %s GROUP BY "find_spot_ID";"""

        cursor.execute(query, (find_spot_id,))
        try:
            chronology = cursor.fetchone()[0]
        except TypeError:
            chronology = None

        cursor.close()
        db.close()

        if find_spot_info is None:
            return { 'message' : 'No spots with id {} found in database.'.format(find_spot_id) }, 404
        else:
            return { 'id': find_spot_id,
                     'toponym' : find_spot_info[0],
                     'type' : find_spot_info[1],
                     'description' : find_spot_info[2],
                     'chronology': chronology }