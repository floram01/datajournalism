# -*- coding: utf-8 -*-

# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: http://doc.scrapy.org/en/latest/topics/item-pipeline.html
from scrapy.exceptions import DropItem

class NobelWinnersPipeline(object):
    def process_item(self, item, spider):
        return item

class DropNonPersons(object):
  def process_item(self,item,spider):
    if spider=='winners_list':
      if not item['gender']:
        raise DropItem('No gender for %s'%item['name'])
      return item