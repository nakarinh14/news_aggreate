import database as db

# Abstract class for Scraper
class Scraper:

    def __init__(self, url, publisher):
        self.url = url
        self.publisher = publisher

    def execute(self):
        # Interface. Override on extend
        return (None, None)

    def getLatestUrl(self, query:str = "SELECT url FROM news_source WHERE publisher=%s ORDER BY date DESC LIMIT 1;", values:list = None):
        values = (self.publisher,) if values is None else values
        return db.findLatestUrl(query, values)

    def insertDB(self):
        insert_query, news_data = self.execute()
        db.insert_batch(insert_query, news_data)

        

   