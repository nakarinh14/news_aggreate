import requests
from lxml import etree

url = "https://www.thairath.co.th/sitemap-daily.xml"
res = request.get(url)
tree = etree.XML(response.content)

NS = {'s': "http://www.sitemaps.org/schemas/sitemap/0.9"}
loc_list = tree.xpath("//s:url/s:loc", namespaces=NS)

for loc in loc_list:
    print(loc.text)
