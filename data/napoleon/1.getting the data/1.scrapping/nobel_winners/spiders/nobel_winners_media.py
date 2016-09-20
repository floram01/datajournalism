from __future__ import unicode_literals
import scrapy
import re


BASE_URL='https://en.wikipedia.org'

class NWinnerItemMedia(scrapy.Item):
  link=scrapy.Field()
  name=scrapy.Field()
  mini_bio=scrapy.Field()
  image_urls=scrapy.Field()
  bio_image=scrapy.Field()
  images=scrapy.Field()
  image_src=scrapy.Field()


class NWinnerSpiderMedia(scrapy.Spider):
  name='winners_media'
  allowed_domains=['en.wikipedia.org']
  start_urls=['https://en.wikipedia.org/wiki/List_of_Nobel_laureates_by_country']

  def parse_mini_bio(self, response):
    BASE_URL_ESCAPED='https:\/\/en.wikipedia.org' 
    item=response.meta['item']
    item['image_urls']=[]
    img_src=response.xpath("//table[contains(@class,'infobox')]//img/@src") 
    if img_src:
      item['image_urls']=['http:' + img_src[0].extract()]

    mini_bio=""
    paras=response.xpath(
      '//*[@id="mw-content-text"]/p[text() or normalize-space(.)=""]'
      ).extract()
    
    for p in paras:
      if p == '<p></p>':
        break
      mini_bio += p

    mini_bio=mini_bio.replace('href="/wiki', 'href="' + BASE_URL + '/wiki')
    mini_bio = mini_bio.replace('href="#', item['link'] + '#')
    item['mini_bio']=mini_bio
    yield item

  def parse(self, response):
    h2s=response.xpath('//h2')

    for h2 in h2s:
      country=h2.xpath('span[@class="mw-headline"]/text()').extract()
      if country:
        winners=h2.xpath('following-sibling::ol[1]')
        for winner in winners.xpath('./li'):
          wdata={}
          wdata['link']=BASE_URL + winner.xpath('a/@href').extract()[0]
          request=scrapy.Request(
            wdata['link'],
            callback=self.parse_mini_bio,
            dont_filter=True
            )
          request.meta['item']=NWinnerItemMedia(**wdata)
          yield request



