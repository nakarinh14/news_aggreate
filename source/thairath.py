import requests
from lxml import etree
from scraper import Scraper
import datetime as dt

class Thairath(Scraper):
    
    def __init__(self):
        Scraper.__init__(
            self, 
            "https://www.thairath.co.th/sitemap-daily.xml",
            "thairath"
        )
    
    def execute(self):
        res = requests.get(self.url)
        tree = etree.XML(res.content)

        NS = {
            's': "http://www.sitemaps.org/schemas/sitemap/0.9", 
            'image':"http://www.google.com/schemas/sitemap-image/1.1"
            }

        parsed_elements = tree.xpath("//s:url/s:loc | //image:image/image:loc | //image:image/image:title | //image:image/image:caption", namespaces=NS)
        insert_query = """ INSERT INTO news_source (url, img, category, date, title, description, publisher) VALUES (%s, %s, %s, %s, %s, %s, %s) ON CONFLICT DO NOTHING"""
        news_data = []
        latest_url = self.getLatestUrl()
        
        timestamp = dt.datetime.now()

        for i in range(int(len(parsed_elements)/4)):
            news_url, img_url, title, caption = parsed_elements[(i*4)].text, parsed_elements[(i*4)+1].text, parsed_elements[(i*4)+2].text, parsed_elements[(i*4)+3].text
            url_split = news_url.split("/")
            category = url_split[4] if url_split[3] == "news" else url_split[3]
            timestamp = timestamp + dt.timedelta(minutes=3) if i == 0 else timestamp # Temporary fixed of latest timestamp. Will have to scrape timestamp on web?
            if latest_url is not None and news_url == latest_url:
                print("break thairath")
                break
            news_data.append((news_url, img_url, category, timestamp, title, caption, self.publisher))

        return insert_query, news_data

if __name__ == "__main__":
    scraper = Thairath()
    scraper.execute()