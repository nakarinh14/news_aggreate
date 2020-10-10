import psycopg2
from psycopg2 import IntegrityError
import psycopg2.extras

# Connect to your postgres DB
class DB:
    def __init__(self, user="kenneh", host="127.0.0.1", port="5432", database="news"):
        try: 
            self.conn = psycopg2.connect(user = user,
                                    host = host,
                                    port = port,
                                    database = database)

            # Open a cursor to perform database operations
            self.cur = self.conn.cursor()
        except:
            print('nope')
            
    def insert_batch(self, query, values):
        try:
            psycopg2.extras.execute_batch(self.cur, query, values)
            self.conn.commit()

        except IntegrityError:
            print("Duplicated URL met")
    
    # def insert_all(self, query, data):

    def insert(self, query, data):
        try:
            self.cur.execute(query, data)
            self.conn.commit()
            
        except IntegrityError:
            print("Duplicated key met")
    