# -*- coding: utf-8 -*-
"""

@author: Chris Lucas
"""

from flask_restplus import Namespace, Resource, fields
from werkzeug.exceptions import NotFound

from core.db import get_db


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

find = api.model('Find', {
    'id': fields.Integer(description="The ID of the find."),
    'description': fields.String(description="The description of the find."),
    'features': fields.List(fields.String(), description="The features of the find."),
    'features_architecture': fields.List(fields.String(), description="The architectural features of the find."),
    'features_sepulchral': fields.List(fields.String(), description="The sepulchral features of the find."),
    'material': fields.List(fields.String(), description="The material of the find."),
    'material_bone': fields.List(fields.String(), description="The bone material of the find."),
    'material_building': fields.List(fields.String(), description="The building material of the find.")
})

photo = api.model('Photo', {
    'id': fields.Integer(description="The ID of the photo."),
    'url': fields.String(description="The URL where the photo can be found."),
    'date': fields.String(description="The date the photo was taken."),
    'description': fields.String(description="A description of what is visible on the photo."),
    'direction': fields.String(description="The compass direction the camera was pointed at."),
    'orientation': fields.String(description="The orientation of the photo (landscape/portrait).")
})

@api.route('/')
class FindSpots(Resource):

    @api.marshal_with(find_spots)
    def get(self):
        """List all find spots in database by id"""

        db = get_db()
        cursor = db.cursor()

        query = 'SELECT "find_spot_ID" FROM seslr.find_spot;'

        cursor.execute(query)
        results = cursor.fetchall()
        cursor.close()

        if results is None:
            raise NotFound('No spots found in database.')
        else:
            results = [result[0] for result in results]
            return { 'find_spot_ids' : results }


@api.route('/<int:find_spot_id>')
class FindSpot(Resource):

    @api.doc(params={"find_spot_id": "The id of the find spot"})
    @api.marshal_with(find_spot, mask='toponym, type, description, chronology')
    def get(self, find_spot_id):
        """Get a find spot by a certain id"""

        db = get_db()
        cursor = db.cursor()

        query = 'SELECT toponym, type2, description FROM seslr.find_spot WHERE "find_spot_ID" = %s;'

        cursor.execute(query, (find_spot_id,))
        find_spot_info = cursor.fetchone()
        if find_spot_info is None:
            raise NotFound('No spots with id {} found in database.'.format(find_spot_id))

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

        return { 'id': find_spot_id,
                 'toponym' : find_spot_info[0],
                 'type' : find_spot_info[1],
                 'description' : find_spot_info[2],
                 'chronology': chronology }


@api.route('/<int:find_spot_id>/find')
class Find(Resource):

    @api.doc(params={"find_spot_id": "The id of the find spot"})
    @api.marshal_with(find, mask='description, features, features_architecture, features_sepulchral, material, material_bone, material_building')
    def get(self, find_spot_id):
        """Get a find by a certain id"""

        db = get_db()
        cursor = db.cursor()

        query = "SELECT description FROM seslr.find_categories WHERE find_spot_id = %s;"

        cursor.execute(query, (find_spot_id,))
        try:
            description = cursor.fetchone()[0]
        except TypeError:
            description = None

        query = """WITH coltorows AS (
	SELECT
		find_spot_id,
		UNNEST(ARRAY['architecture', 'floors', 'pavement', 'stone_alignment', 'remotely_sensed_features', 'rock_cuttings', 'sepulchral', 'negative_feature']) AS col_name,
		UNNEST(ARRAY["architecture", "floors", "pavement", "stone_alignment", "remotely_sensed_features", "rock_cuttings", "sepulchral", "negative_feature"]) AS col_value
	FROM seslr.find_features
)
SELECT array_agg(col_name) AS true_col_names FROM coltorows WHERE col_value AND find_spot_id = %s GROUP BY find_spot_id;"""

        cursor.execute(query, (find_spot_id,))
        try:
            features = cursor.fetchone()[0]
        except TypeError:
            features = None

        query = """WITH coltorows AS (
	SELECT
		find_spot_id,
		UNNEST(ARRAY['enclosure_walls', 'terrace_walls', 'foundation_walls', 'defensive_walls', 'building_walls', 'wall', 'retaining_walls', 'other']) AS col_name,
		UNNEST(ARRAY["enclosure_walls", "terrace_walls", "foundation_walls", "defensive_walls", "building_walls", "wall", "retaining_walls", "other"]) AS col_value
	FROM seslr.find_features_architecture
)
SELECT array_agg(col_name) AS true_col_names FROM coltorows WHERE col_value AND find_spot_id = %s GROUP BY find_spot_id;"""

        cursor.execute(query, (find_spot_id,))
        try:
            features_architecture = cursor.fetchone()[0]
        except TypeError:
            features_architecture = None

        query = """WITH coltorows AS (
	SELECT
		find_spot_id,
		UNNEST(ARRAY['cist', 'sarcophagus', 'mausoleum']) AS col_name,
		UNNEST(ARRAY["cist", "sarcophagus", "mausoleum"]) AS col_value
	FROM seslr.find_features_sepulchral
)
SELECT array_agg(col_name) AS true_col_names FROM coltorows WHERE col_value AND find_spot_id = %s GROUP BY find_spot_id;"""

        cursor.execute(query, (find_spot_id,))
        try:
            features_sepulchral = cursor.fetchone()[0]
        except TypeError:
            features_sepulchral = None

        query = """WITH coltorows AS (
	SELECT
		find_spot_id,
		UNNEST(ARRAY['pottery', 'glass', 'metal', 'lithics', 'various', 'ceramic_building_material', 'botanical', 'bone', 'slag']) AS col_name,
		UNNEST(ARRAY["pottery", "glass", "metal", "lithics", "various", "ceramic_building_material", "botanical", "bone", "slag"]) AS col_value
	FROM seslr.find_material
)
SELECT array_agg(col_name) AS true_col_names FROM coltorows WHERE col_value AND find_spot_id = %s GROUP BY find_spot_id;"""

        cursor.execute(query, (find_spot_id,))
        try:
            material = cursor.fetchone()[0]
        except TypeError:
            material = None

        query = """WITH coltorows AS (
	SELECT
		find_spot_id,
		UNNEST(ARRAY['human', 'animal', 'unknown']) AS col_name,
		UNNEST(ARRAY["human", "animal", "unknown"]) AS col_value
	FROM seslr.find_material_bone
)
SELECT array_agg(col_name) AS true_col_names FROM coltorows WHERE col_value AND find_spot_id = %s GROUP BY find_spot_id;"""

        cursor.execute(query, (find_spot_id,))
        try:
            material_bone = cursor.fetchone()[0]
        except TypeError:
            material_bone = None

        query = """WITH coltorows AS (
	SELECT
		find_spot_id,
		UNNEST(ARRAY['tile', 'brick', 'spolia', 'mortar', 'blocks', 'rubble', 'arch_members']) AS col_name,
		UNNEST(ARRAY["tile", "brick", "spolia", "mortar", "blocks", "rubble", "arch_members"]) AS col_value
	FROM seslr.find_material_building
)
SELECT array_agg(col_name) AS true_col_names FROM coltorows WHERE col_value AND find_spot_id = %s GROUP BY find_spot_id;"""

        cursor.execute(query, (find_spot_id,))
        try:
            material_building = cursor.fetchone()[0]
        except TypeError:
            material_building = None

        cursor.close()

        info = [description, features, features_architecture, features_sepulchral, material, material_bone, material_building]
        if all(value is None for value in info):
            raise NotFound('No finds with id {} found in database.'.format(find_spot_id))
        else:
            return {
                "id": find_spot_id,
                "description": description,
                "features": features,
                "features_architecture": features_architecture,
                "features_sepulchral": features_sepulchral,
                "material": material,
                "material_bone": material_bone,
                "material_building": material_building
            }


@api.route('/<int:find_spot_id>/photos')
class Photos(Resource):

    @api.doc(params={"find_spot_id": "The id of the find spot"})
    @api.marshal_list_with(photo)
    def get(self, find_spot_id):
        """Get the photos taken at a find spot"""

        db = get_db()
        cursor = db.cursor()

        query = 'SELECT "photo_ID" FROM seslr.photo_link WHERE "find_spot_ID" = %s;'
        cursor.execute(query, (find_spot_id,))
        photo_ids = cursor.fetchall()

        if photo_ids is None or photo_ids == []:
            raise NotFound('No photos found for find spot: {}'.format(find_spot_id))

        photos = []

        for photo_id, in photo_ids:
            query = 'SELECT * FROM seslr.photo_new WHERE "photo_ID" = %s;'
            cursor.execute(query, (photo_id,))
            photo_info = cursor.fetchone()
            if photo_info is None:
                photos.append({
                    'id': photo_id,
                    'url': 'https://euboia.labs.vu.nl/photos/{}'.format(photo_id),
                })
            else:
                photos.append({
                    'id': photo_id,
                    'url': 'https://euboia.labs.vu.nl/photos/{}'.format(photo_id),
                    'date': photo_info[1].date().isoformat(),
                    'description': photo_info[3],
                    'direction': photo_info[2],
                    'orientation': 'landscape' if photo_info[4] else 'portrait'
                })

        return photos
