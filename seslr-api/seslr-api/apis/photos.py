# -*- coding: utf-8 -*-
"""

@author: Chris Lucas
"""

from flask_restplus import Namespace, Resource, fields
from werkzeug.exceptions import NotFound

from core.db import get_db


api = Namespace(
    'Photos',
    description='Information on the photos taken at find spots.'
)

photos = api.model('Photos', {
    'photo_ids': fields.List(
        fields.Integer(),
        description="All photo ids found in the database."
    )
})

photo = api.model('Photo', {
    'id': fields.Integer(description="The ID of the photo."),
    'url': fields.String(description="The URL where the photo can be found."),
    'date': fields.String(description="The date the photo was taken."),
    'description': fields.String(
        description="A description of what is visible on the photo."
    ),
    'direction': fields.String(
        description="The compass direction the camera was pointed at."
    ),
    'orientation': fields.String(
        description="The orientation of the photo (landscape/portrait)."
    )
})


@api.route('/')
class FindSpots(Resource):

    @api.marshal_with(photos)
    def get(self):
        """List all photos in database by id"""

        db = get_db()
        cursor = db.cursor()

        query = 'SELECT "photo_ID" FROM seslr.photo_new;'

        cursor.execute(query)
        results = cursor.fetchall()
        cursor.close()

        if results is None:
            raise NotFound('No photos found in database.')
        else:
            results = [result[0] for result in results]
            return {'photo_ids': results}


@api.route('/<int:photo_id>/')
class Photos(Resource):

    @api.doc(params={"photo_id": "The id of the photo."})
    @api.marshal_with(photo)
    def get(self, photo_id):
        """Get the information on a photo."""

        db = get_db()
        cursor = db.cursor()

        query = 'SELECT * FROM seslr.photo_new WHERE "photo_ID" = %s;'
        cursor.execute(query, (photo_id,))
        photo_info = cursor.fetchone()
        if photo_info is None:
            raise NotFound(
                'No info found for photo with id: {}'.format(photo_id)
            )

        result = {
            'id': photo_id,
            'url': ('https://euboia.labs.vu.nl/dev/photos/'
                    '{}.jpg').format(photo_id),
            'date': photo_info[1].date().isoformat(),
            'description': photo_info[3],
            'direction': photo_info[2],
            'orientation': 'landscape' if photo_info[4] else 'portrait'
        }

        return result
