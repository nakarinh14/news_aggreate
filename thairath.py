import requests
from lxml import etree

url = "https://www.thairath.co.th/sitemap-daily.xml"
res = requests.get(url)
tree = etree.XML(res.content)
NS = {'s': "http://www.sitemaps.org/schemas/sitemap/0.9", 'image':"http://www.google.com/schemas/sitemap-image/1.1"}

# for a in root.iterfind(f".//{{{NS['s']}}}loc"):
    # print(a.text)
parsed_elements = tree.xpath("//s:url/s:loc | //image:image/image:loc | //image:image/image:title | //image:image/image:caption", namespaces=NS)

for i in range(int(len(parsed_elements)/4)):
    news_url, img_url, title, caption = parsed_elements[(i*4)].text, parsed_elements[(i*4)+1].text, parsed_elements[(i*4)+2].text, parsed_elements[(i*4)+3].text
    print(f"News url {news_url}")
    print(f"img url {img_url}")
    print(f"title url {title}")
    print(f"caption url {caption}")
