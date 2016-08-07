#!/usr/bin/env python
# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import pandas as pd
from pymongo import MongoClient
import numpy as np


french_trad={
  'Fencing':'Escrime',
  'Canoeing':'Canoe/Kayak',
  'Cycling':'Cyclisme',
  'Rowing':'Aviron',
  'Equestrian':'Equitation',
  'Table tennis':'Tennis de table',
  'Sailing':'Voile',
  'Wrestling':'Lutte',
  'Swimming':'Natation',
  'Shooting':'Tir',
  'Basque Pelota':'Pelote Basque',
  'Synchronized swimming':u'Natation synchronisée'
}

def prepare_data_sources():
    results_by_disciplines()
    france_best_disciplines_ever()
    
def results_by_disciplines():
  from data_params import DATABASE, PROJECT
  # DATABASE='summer_olypics'
  # PROJECT='summer_olypics'
  import sys
  sys.path.insert(0, "../data_tools/")
  sys.path.insert(0, "../../static/summer_olypics/")


  from mongo_tools import mongo_to_dataframe,dataframe_to_mongo,get_mongo_database,mongo_coll_to_dicts
  from my_logger import logger

  df = mongo_to_dataframe(DATABASE, 'full_data')

  # france = df[df.country_name=='France']
  # france_medal_count = france.drop_duplicates(subset=['Edition','Event','Gender','Medal','Discipline'])
  df_medal_count = df.drop_duplicates(subset=['Edition','Event','Gender','Medal','Discipline'])

  # france_medal_count_recent = france_medal_count[france_medal_count.Edition>1988]
  df_medal_count_recent = df_medal_count[df_medal_count.Edition>1988]
  
  # pct by gender
  df_medal_by_country = df_medal_count_recent.groupby(['country_name','Gender','Discipline']).size()
  df_medal_total = df_medal_count_recent.groupby(['Gender','Discipline']).size()
  df_medal_by_country = df_medal_by_country.reset_index().rename(columns={0:'country_value'})
  df_medal_total = df_medal_total.reset_index().rename(columns={0:'total_value'})
  df_merged = pd.merge(df_medal_by_country, df_medal_total, on=['Gender','Discipline'], how='outer')
  df_merged['value'] = df_merged['country_value']/df_merged['total_value']

  #total pct
  df_medal_by_country_detail = df_medal_count_recent.groupby(['country_name','Discipline']).size()
  df_medal_total_detail = df_medal_count_recent.groupby(['Discipline']).size()
  df_medal_by_country_detail = df_medal_by_country_detail.reset_index().rename(columns={0:'country_value'})
  df_medal_total_detail = df_medal_total_detail.reset_index().rename(columns={0:'total_value'})
  df_merged_detail = pd.merge(df_medal_by_country_detail, df_medal_total_detail, on=['Discipline'], how='outer')
  df_merged_detail['value'] = df_merged_detail['country_value']/df_merged_detail['total_value']
  df_merged_detail['Gender']='All'

  
  df_france_best_disciplines = pd.concat([df_merged, df_merged_detail])  
  # df_france_best_disciplines = df_france_best_disciplines.loc[:9,:] 
  df_france_best_disciplines.Discipline = df_france_best_disciplines.Discipline.replace(french_trad)
  logger.info('inserting df with shape: ' + str(df_france_best_disciplines.shape))
  #dataframe_to_mongo(df_france_best_disciplines, DATABASE, 'france_best_disciplines', erase=True)
  #logger.info('insertion sucessful in db' + DATABASE + ' of collection: ' + 'df_france_best_disciplines')
  df_france_best_disciplines.to_json('../../static/viz/summer_olympics/data_sources/results_by_disciplines.json', orient='records')    

def france_best_disciplines_ever():
  from data_params import DATABASE, PROJECT
  # DATABASE='summer_olypics'
  # PROJECT='summer_olypics'
  import sys
  sys.path.insert(0, "../data_tools/")
  sys.path.insert(0, "../../static/summer_olypics/")


  from mongo_tools import mongo_to_dataframe,dataframe_to_mongo,get_mongo_database,mongo_coll_to_dicts
  from my_logger import logger

  df = mongo_to_dataframe(DATABASE, 'full_data')

  france = df[df.country_name=='France']
  france_medal_count = france.drop_duplicates(subset=['Edition','Event','Gender','Medal','Discipline'])
  df_medal_count = df.drop_duplicates(subset=['Edition','Event','Gender','Medal','Discipline'])

  france_medal_count_recent = france_medal_count
  df_medal_count_recent = df_medal_count

  france_recent_pct = france_medal_count_recent.groupby(['Discipline']).size()/\
  df_medal_count_recent.groupby(['Discipline']).size()
  df_france_best_disciplines = france_recent_pct.sort_values(ascending=False).reset_index().rename(columns={0:'value'})
  df_france_best_disciplines = df_france_best_disciplines.loc[:2,:] 
  df_france_best_disciplines.Discipline = df_france_best_disciplines.Discipline.replace(french_trad)

  logger.info('inserting df with shape: ' + str(df_france_best_disciplines.shape))
  #dataframe_to_mongo(df_france_best_disciplines, DATABASE, 'france_best_disciplines', erase=True)
  #logger.info('insertion sucessful in db' + DATABASE + ' of collection: ' + 'df_france_best_disciplines')

  df_france_best_disciplines.to_json('../../static/viz/summer_olympics/data_sources/france_best_disciplines_ever.json', orient='records')