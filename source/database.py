import psycopg2
from psycopg2 import IntegrityError
import psycopg2.extras
import sys

# Connect to your postgres DB
try:
    conn = psycopg2.connect(user = "kenneh",
                            host = "127.0.0.1",
                            port = "5432",
                            database = "news")

                # Open a cursor to perform database operations
    cur = conn.cursor()

except:
    print(sys.exc_info()[0])
            
def insert_batch(query, values: list):
    try:
        if len(values) > 0:
            psycopg2.extras.execute_batch(cur, query, values)
            conn.commit()

    except IntegrityError:
        print("Duplicated URL met")
    
    # def insert_all(self, query, data):

def insert(query: str, data):
    try:
        cur.execute(query, data)
        conn.commit()
        
    except IntegrityError:
        print("Duplicated key met")

def findLatestUrl(query: str, values: list):
    try:
        cur.execute(query, values)
        result = cur.fetchone()
        return result[0] if result is not None else result
    except:
        print(sys.exc_info()[0])
        return None