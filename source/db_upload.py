import psycopg2
from psycopg2 import IntegrityError


# Connect to your postgres DB
def upload_db(query, data):
    try: 
        conn = psycopg2.connect(user = "kenneh",
                                host = "127.0.0.1",
                                port = "5432",
                                database = "news")

        # Open a cursor to perform database operations
        cur = conn.cursor()
        cur.execute(query, data)
        conn.commit()
    except IntegrityError:
        print("Duplicated key met")