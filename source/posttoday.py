import requests
from lxml import etree
from scraper import Scraper
import datetime as dt
from news_utils import strip_text

class Posttoday(Scraper):
    
    def __init__(self):
        Scraper.__init__(
            self, 
            [
                "http://www.posttoday.com/rss/src/politics.xml",
                "http://www.posttoday.com/rss/src/world.xml",
                "http://www.posttoday.com/rss/src/entertainment.xml",
                "http://www.posttoday.com/rss/src/lifestyle.xml"
            ],
            "posttoday"
        )
    
    def execute(self):
        insert_query = """ INSERT INTO news_source (url, category, date, title, description, publisher) VALUES (%s, %s, %s, %s, %s, %s) ON CONFLICT DO NOTHING"""
        news_data = []
        for rss_url in self.url:
            res = requests.get(rss_url)
            tree = etree.XML(res.content)
            category = str(rss_url.split('/')[-1][:-4])
            parsed_elements = tree.xpath("//item/title | //item/link | //item/description | //item/pubDate")
            latest_url = self.getLatestUrl("SELECT url FROM news_source WHERE publisher=%s AND category=%s ORDER BY date DESC LIMIT 1;", (self.publisher, category))

            for i in range(int(len(parsed_elements)/4)):
                title = strip_text(parsed_elements[(i*4)].text)
                news_url = strip_text(parsed_elements[(i*4)+1].text)
                caption = strip_text(parsed_elements[(i*4)+2].text)
                time = strip_text(parsed_elements[(i*4)+3].text)
                timestamp = dt.datetime.strptime(time, "%a, %d %b %Y %H:%M:%S %z")
                if latest_url is not None and news_url == latest_url:
                    print("break posttoday...")
                    break
                
                news_data.append((news_url, category, timestamp, title, caption, self.publisher))
        return insert_query, news_data

if __name__ == "__main__":
    scraper = Posttoday()
    scraper.execute()