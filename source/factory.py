from database import DB
from thairath import Thairath
from sanook import Sanook
from posttoday import Posttoday

class ScraperFactory:
    
    builders = {
        'thairath': Thairath,
        'sanook': Sanook,
        'posttoday': Posttoday
    }

    db = DB()

    def build(self, publisher:str):
        scraper = self.builders[publisher]()
        return scraper.execute()

    def buildAll(self):
        for builder in self.builders:
            insert_query, news_data = self.build(builder)
            self.db.insert_batch(insert_query, news_data)



if __name__ == "__main__":
    factory = ScraperFactory()
    factory.buildAll()