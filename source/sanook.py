import requests
from lxml import etree
from scraper import Scraper

class Sanook(Scraper):
    def __init__(self):
        Scraper.__init__(
            self, 
            "https://www.sanook.com/news/sitemap/today/",
            "sanook"
        )
        
    def execute(self):
        res = requests.get(self.url)
        tree = etree.XML(res.content)
        NS = {
            's': "http://www.sitemaps.org/schemas/sitemap/0.9", 
            'image':"http://www.google.com/schemas/sitemap-image/1.1", 
            'news':"http://www.google.com/schemas/sitemap-news/0.9"
            }

        parsed_elements = tree.xpath("//s:url/s:loc | //image:image/image:loc | //news:news/news:title", namespaces=NS)
        insert_query = """ INSERT INTO news_source (url, img, category, date, title, publisher) VALUES (%s, %s, %s, now(), %s, %s)"""
        news_data = []
        for i in range(int(len(parsed_elements)/3)):
            news_url, title, img_url = parsed_elements[(i*3)].text, parsed_elements[(i*3)+1].text, parsed_elements[(i*3)+2].text
            category = ''
            news_data.append((news_url, img_url, category, title, self.publisher))
        # print(news_data)
        return insert_query, news_data    

if __name__ == "__main__":
    scraper = Sanook()
    scraper.execute()