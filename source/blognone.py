import requests
from bs4 import BeautifulSoup
from scraper import Scraper
import time
import random
import datetime as dt
    
class Blognone(Scraper):

    def __init__(self):
        super().__init__("blognone")
    
    def execute(self):
        base_url = "https://www.blognone.com/node?page="
        news_data, count = [], 0
        latest_url = self.getLatestUrl()
        curr_date, category = dt.datetime.now(), "technology"
        stop_execute = False
        while not stop_execute:
            res = self.get_request(base_url+str(count))
            soup = BeautifulSoup(res.text, 'html.parser')
            posts = soup.find("div", id="block-system-main").find_all("div", {"class": ["node","clearfix"]})
            for post in posts:
                # Get all the required information
                news_url, title, img_url, timestamp = self.parseNode(post)
                if (latest_url is not None and news_url == latest_url) or (curr_date - timestamp).days >= 2:
                    print(f"Duplicate found... Stopping {self.publisher}")
                    stop_execute = True
                    break
                news_data.append((news_url, img_url, category, timestamp, title, self.publisher))

            count += 1
            time.sleep(5+(5*random.random()))
        
        insert_query = """ INSERT INTO news_source (url, img, category, date, title, publisher) VALUES (%s, %s, %s, %s, %s, %s)"""
        return insert_query, news_data
            
        
    def parseNode(self, node):
        title_box = node.find("div", class_="content-title-box")
        news_url = "https://www.blognone.com" + title_box.find("a")["href"]
        title = title_box.find("a").string
        img = node.find("div", class_="node-image").find("img")['src']
        date = node.find("span", class_="submitted").get_text().split("  on ")[1]
        parse_date = dt.datetime.strptime(date, "%d %B %Y - %H:%M")

        return news_url, title, img, parse_date

if __name__ == "__main__":
    scraper = Blognone()
    print(scraper.execute())