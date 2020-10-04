import requests
from lxml import etree
from db_upload import upload_db
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
        NS = {'s': "http://www.sitemaps.org/schemas/sitemap/0.9", 'image':"http://www.google.com/schemas/sitemap-image/1.1", 'news':"http://www.google.com/schemas/sitemap-news/0.9"}
        parsed_elements = tree.xpath("//s:url/s:loc | //image:image/image:loc | //news:news/news:title", namespaces=NS)

        for i in range(int(len(parsed_elements)/3)):
            
            news_url, img_url, title = parsed_elements[(i*4)].text, parsed_elements[(i*4)+1].text, parsed_elements[(i*4)+2].text
            url_split = news_url.split("/")
            category = url_split[4] if url_split[3] == "news" else url_split[3]

            news_insert_query = """ INSERT INTO news_source (url, img, category, date, title, description, publisher) VALUES (%s, %s, %s, now(), %s, %s, %s)"""
            news_data_insert = (news_url, img_url, category, title, self.publisher)
            upload_db(news_insert_query, news_data_insert)

if __name__ == "__main__":
    scraper = Sanook()
    scraper.execute()