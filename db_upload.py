import psycopg2

# Connect to your postgres DB
conn = psycopg2.connect(user = "kenneh",
                        host = "127.0.0.1",
                        port = "5432",
                        database = "news")

# Open a cursor to perform database operations
cur = conn.cursor()

url = "https://www.thairath.co.th/sitemap-daily.xml"
res = requests.get(url)
tree = etree.XML(res.content)
NS = {'s': "http://www.sitemaps.org/schemas/sitemap/0.9", 'image':"http://www.google.com/schemas/sitemap-image/1.1"}
publisher = "thairath"
parsed_elements = tree.xpath("//s:url/s:loc | //image:image/image:loc | //image:image/image:title | //image:image/image:caption", namespaces=NS)

for i in range(int(len(parsed_elements)/4)):
    
    news_url, img_url, title, caption = parsed_elements[(i*4)].text, parsed_elements[(i*4)+1].text, parsed_elements[(i*4)+2].text, parsed_elements[(i*4)+3].text
    url_split = news_url.split("/")
    category = url_split[4] if url_split[3] == "news" else url_split[3]
    assert isinstance(caption, str) == True
    news_insert_query = """ INSERT INTO news_source (url, img, category, date, title, description, publisher) VALUES (%s, %s, %s, now(), %s, %s, %s)"""
    news_data_insert = (news_url, img_url, category, title, caption, publisher)
    cur.execute(news_insert_query, news_data_insert)
    conn.commit()
    
# Execute a query
cur.execute("SELECT * FROM news_source")

# Retrieve query results
records = cur.fetchall()
print(len(records))
