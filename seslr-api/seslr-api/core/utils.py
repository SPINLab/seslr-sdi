# -*- coding: utf-8 -*-
"""

@author: Chris Lucas
"""

import psycopg2


def connect_to_database():
    try:
        conn = psycopg2.connect(database=os.environ['POSTGRES_DB'],
                                user=os.environ['POSTGRES_USER'],
                                password=os.environ['POSTGRES_PASSWORD'],
                                host='database',
                                port=5432)
        conn.set_session(autocommit=False)
        return conn
    except Exception:
        print("Unable to connect to the database.")
        return None
