import re
import scrapy

BASE_URL='https://en.wikipedia.org'

class WinnerItem(scrapy.Item):
    country = scrapy.Field()
    country_code = scrapy.Field()
    country_link = scrapy.Field()
    medal = scrapy.Field()
    name = scrapy.Field()
    sport = scrapy.Field()
    event = scrapy.Field()
    date = scrapy.Field()

class WinnerSpider(scrapy.Spider):
    name = 'winners_list'
    allowed_domains=['en.wikipedia.org']
    start_urls = ['https://en.wikipedia.org/wiki/2012_Summer_Olympics_medal_table']

    def parse_detail(self, response):
        item = response.meta['item']
        # wins = response.xpath('//*[@id="mw-content-text"]/div[3]/table//tr[td]')[1:]
        if item['country'] in ['Belarus', 'Finland','Sweden','India']:
            wins = response.xpath('//table[contains(@class, "wikitable")][2]/tr[td]')
        # elif item['country'] in ['Venezuela','Algeria','Turkey']:
        #     wins = response.xpath('//table[contains(@class, "wikitable")][1]/tr[td]')
        else:
            wins = response.xpath('//table[contains(@class, "wikitable")]')[0].xpath('tr[td]')
        for win in wins :
            item['medal'] = win.xpath('td')[0].xpath('descendant-or-self::text()').extract()[0]
            item['name'] = win.xpath('td')[1].xpath('descendant-or-self::text()').extract()[0]
            item['sport'] = win.xpath('td')[2].xpath('descendant-or-self::text()').extract()[0]
            item['event'] = win.xpath('td')[3].xpath('descendant-or-self::text()').extract()[0]
            item['date'] = win.xpath('td')[4].xpath('descendant-or-self::text()').extract()[0]

            yield item


    def parse(self, response):
        countries = response.xpath("//*[@id='mw-content-text']/table[2]/tr/th[@scope='row']")
        for country in countries:
            item = {}
            item['country'] = country.xpath('descendant-or-self::text()').extract()[1]
            item['country_code'] = country.xpath('descendant-or-self::text()').extract()[3]
            item['country_link'] = country.xpath('a/@href').extract()[0]

            if item['country_link']:
                request=scrapy.Request(
                    BASE_URL + item['country_link'],
                    callback=self.parse_detail,
                    dont_filter=True
                    )
                request.meta['item']=WinnerItem(**item)

                yield request

