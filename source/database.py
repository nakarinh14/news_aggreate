import psycopg2
from psycopg2 import IntegrityError
import psycopg2.extras
import sys

# Connect to postgres DB
try:
    conn = psycopg2.connect(user = "kenneh",
                            host = "127.0.0.1",
                            port = "5432",
                            database = "news")
    cur = conn.cursor()

except:
    print(sys.exc_info()[0])
            
def insert_batch(query, values: list):
    try:
        if len(values) > 0:
            psycopg2.extras.execute_batch(cur, query, values)
            conn.commit()
            print("Data inserted sucessfully")

    except IntegrityError:
        print("Duplicated URL met on DB... Shouldn't happen... Check Scraper API")
    
    # def insert_all(self, query, data):

def insert(query: str, data):
    try:
        cur.execute(query, data)
        conn.commit()
        print("Data inserted sucessfully")
        
    except IntegrityError:
        print("Duplicated URL met on DB... Shouldn't happen... Check Scraper API")

def findLatestUrl(query: str, values: list):
    try:
        cur.execute(query, values)
        result = cur.fetchone()
        return result[0] if result is not None else result
    except:
        print(sys.exc_info()[0])
        return None