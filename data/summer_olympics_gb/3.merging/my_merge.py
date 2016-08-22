import pandas as pd
from pymongo import MongoClient
import numpy as np

def my_merge():
  from data_params import DATABASE, DOMAIN
  from mongo_tools import mongo_to_dataframe,dataframe_to_mongo,get_mongo_database,mongo_coll_to_dicts
  # from my_logger import logger

  winners_histo = mongo_to_dataframe(DATABASE, 'winners_1896_2008')
  winners_2012 = mongo_to_dataframe(DATABASE, 'winners_2012')
  winners_france_2016 = mongo_to_dataframe(DATABASE, 'results_france_2016')
  winners_gb_2016 = mongo_to_dataframe(DATABASE, 'results_gb_2016')

  wb = mongo_to_dataframe(DATABASE, 'wb_demo_eco')
  country_mapper = mongo_to_dataframe('utilities', 'country_code')
  #add city to London 2012 event
  winners_2012['City'] = 'London'
  winners_2012['Edition'] = 2012
  
  #add country to 2016 results
  winners_france_2016['Country'] = 'France'
  winners_gb_2016['Country'] = 'United Kingdom'
  #clean event names
  winners_france_2016.Event = winners_france_2016.Event.str.replace("Men's ","")
  winners_france_2016.Event = winners_france_2016.Event.str.replace("Women's ","")
  winners_gb_2016.Event = winners_gb_2016.Event.str.replace("Men's ","")
  winners_gb_2016.Event = winners_gb_2016.Event.str.replace("Women's ","")
  #add NOC column
  winners_gb_2016['NOC'] = 'GBR'
  winners_france_2016['NOC'] = 'FRA'

  RENAME_2012_COL = {
      'country_code':'NOC',
      'name':'Athlete',
      'medal':'Medal',
      'country':'Country',
      'country_link':'Country_link',
      'date':'Date',
      'sport':'Discipline',
      'event':'Event'
  }
  winners_2012.rename(columns=RENAME_2012_COL, inplace=True)

  #
  RENAME_2012_MEDALS = {
      '01':'Gold',
      '02':'Silver',
      '03':'Bronze',
  }
  winners_2012.Medal.replace(RENAME_2012_MEDALS, inplace=True) 

  #convergence and cleaning of discipline
  RENAME_D_OTHER = {
      'Artistic G.':'Gymnastics',
      'Wrestling Gre-R':'Wrestling',
      'Wrestling Free.':'Wrestling',
      'Cycling Road':'Cycling',
      'Cycling Track':'Cycling',
      'Canoe / Kayak S':'Canoeing',
      'Canoe / Kayak F':'Canoe slalom',
      'Synchronized S.':'Synchronized swimming',
      'Modern Pentath.':'Modern pentathlon',
      'Soccer':'Football',
      'Table Tennis':'Table tennis',
      'Rhythmic G.':'Rhythmic gymnastics',
      'Lacrosse':'Field hockey',
      'Jumping':'Equestrian',
      'Polo':'Equestrian',
      'Dressage':'Equestrian',
      'Eventing':'Equestrian',
      'Vaulting':'Equestrian',
      'Hockey':'Field hockey',
      'Beach volley.':'Volleyball',
      'BMX':'Cycling',
      'Mountain Bike':'Cycling'
  }
  winners_histo.Discipline.replace(RENAME_D_OTHER, inplace=True)

  RENAME_D_2012 = {
      'Soccer':'Football',
      'Track & field':'Athletics',
      'Modern':'Modern pentathlon',
      'Synchronized':'Synchronized swimming'
  }
  winners_2012.Discipline.replace(RENAME_D_2012, inplace=True)

  #event and gender
  winners_2012.loc[winners_2012.Event.str.contains("Men's"),'Gender'] ='Men'
  winners_2012.loc[winners_2012.Event.str.contains("Women's"),'Gender'] ='Women'
  winners_2012.Event = winners_2012.Event.str.replace("Men's ","")
  winners_2012.Event = winners_2012.Event.str.replace("Women's ","")
  #merge results
  winners_all = pd.concat([winners_2012, winners_histo, winners_france_2016, winners_gb_2016], join='outer')
  del winners_all['Sport']
  del winners_all['Event_gender']
  del winners_all['Date']
  # del winners_all['Country']

  #merge eco/demo
  # wb.head()
  # wb.rename(columns={'ISO3':'NOC','year':'Edition'}, inplace=True)
  # wb.Edition = wb.Edition.astype('float')

  # full_data = pd.merge(winners_all, wb, on=['Edition','NOC'], how='outer')
  # del country_mapper['UN']
  
  #final cleaning
  winners_all.dropna(subset=['Athlete'], inplace=True)
  winners_all.Edition = pd.to_datetime(winners_all.Edition.map(int).map(str), format='%Y').map(lambda x : x.year)
  winners_all = pd.merge(winners_all, country_mapper, left_on='NOC',right_on='ISO3', how='outer')
  return winners_all  

TO_MERGE = [
  {'method':my_merge, 'collection_name':'full_data'}
  ]