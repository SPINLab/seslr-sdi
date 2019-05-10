# -*- coding: utf-8 -*-
"""

@author: Chris Lucas
"""

import os
import psycopg2
from flask import g


def connect_to_database():
    try:
        conn = psycopg2.connect(host='database',
                                database=os.environ['POSTGRES_DB'],
                                user=os.environ['POSTGRES_USER'],
                                password=os.environ['POSTGRES_PASSWORD'],
                                port=5432)
        conn.set_session(autocommit=False)
        return conn
    except Exception:
        print("Unable to connect to the database.")
        return None


def get_db():
    if 'db' not in g:
        g.db = connect_to_database()

    return g.db


def close_db(e=None):
    db = g.pop('db', None)

    if db is not None:
        db.close()


def init_app(app):
    app.teardown_appcontext(close_db)
