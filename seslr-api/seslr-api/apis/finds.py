# -*- coding: utf-8 -*-
"""

@author: Chris Lucas
"""

from flask_restplus import Namespace, Resource, fields

from core.utils import connect_to_database


api = Namespace('Finds', description='Information on the finds')

finds = api.model('Finds', {
    'find_spot_ids': fields.List(fields.Integer(), description="All find spot ids found in the database.")
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

@api.route('/')
class Finds(Resource):

    @api.marshal_with(finds)
    def get(self):
        """Get all finds in database by id"""

        db = connect_to_database()
        cursor = db.cursor()

        query = 'SELECT "find_spot_ID" FROM seslr.find_spot;'

        cursor.execute(query)
        results = cursor.fetchall()
        cursor.close()
        db.close()

        if results is None:
            return { 'message' : 'No finds found in database.' }, 404
        else:
            results = [result[0] for result in results]
            return { 'find_spot_ids' : results }


@api.route('/<int:find_spot_id>')
class Find(Resource):

    @api.doc(params={"find_spot_id": "The id of the find spot"})
    @api.marshal_with(find, mask='description, features, features_architecture, features_sepulchral, material, material_bone, material_building')
    def get(self, find_spot_id):
        """Get a find by a certain id"""

        db = connect_to_database()
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
        db.close()

        info = [description, features, features_architecture, features_sepulchral, material, material_bone, material_building]
        if all(value is None for value in info):
            return 'No finds with id {} found in database.'.format(find_spot_id), 404
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
