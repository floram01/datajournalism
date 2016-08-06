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
    france_best_disciplines()
    france_best_disciplines_men()
    france_best_disciplines_women()
    france_best_disciplines_ever()
    
def france_best_disciplines():
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

  france_medal_count_recent = france_medal_count[france_medal_count.Edition>1988]
  df_medal_count_recent = df_medal_count[df_medal_count.Edition>1988]
  
  france_recent_pct = france_medal_count_recent.groupby(['Gender','Discipline']).size()/\
  df_medal_count_recent.groupby(['Gender','Discipline']).size()

  france_recent_pct_total = france_medal_count_recent.groupby(['Discipline']).size()/\
  df_medal_count_recent.groupby(['Discipline']).size()  
  df_france_best_disciplines = france_recent_pct.sort_values(ascending=False).reset_index().rename(columns={0:'value'})
  df_france_best_disciplines_total = france_recent_pct_total.sort_values(ascending=False).reset_index().rename(columns={0:'value'})
  df_france_best_disciplines_total['Gender']='All'

  
  df_france_best_disciplines = pd.concat([df_france_best_disciplines, df_france_best_disciplines_total])  
  # df_france_best_disciplines = df_france_best_disciplines.loc[:9,:] 
  # df_france_best_disciplines.Discipline = df_france_best_disciplines.Discipline.replace(french_trad)

  logger.info('inserting df with shape: ' + str(df_france_best_disciplines.shape))
  #dataframe_to_mongo(df_france_best_disciplines, DATABASE, 'france_best_disciplines', erase=True)
  #logger.info('insertion sucessful in db' + DATABASE + ' of collection: ' + 'df_france_best_disciplines')
  df_france_best_disciplines.to_json('../../static/viz/summer_olympics/france_best_disciplines_total.json', orient='records')    

def france_best_disciplines_men():
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

  france_medal_count_recent = france_medal_count[(france_medal_count.Edition>1988)&(france_medal_count.Gender=='Men')]
  df_medal_count_recent = df_medal_count[(df_medal_count.Edition>1988)&(df_medal_count.Gender=='Men')]

  france_recent_pct = france_medal_count_recent.groupby(['Discipline']).size()/\
  df_medal_count_recent.groupby(['Discipline']).size()
  df_france_best_disciplines = france_recent_pct.sort_values(ascending=False).reset_index().rename(columns={0:'value'})
  df_france_best_disciplines = df_france_best_disciplines.loc[:9,:]
  df_france_best_disciplines.Discipline = df_france_best_disciplines.Discipline.replace(french_trad)

  logger.info('inserting df with shape: ' + str(df_france_best_disciplines.shape))
  #dataframe_to_mongo(df_france_best_disciplines, DATABASE, 'france_best_disciplines', erase=True)
  #logger.info('insertion sucessful in db' + DATABASE + ' of collection: ' + 'df_france_best_disciplines')

  df_france_best_disciplines.to_json('../../static/viz/summer_olympics/france_best_disciplines_men.json', orient='records')

def france_best_disciplines_women():
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

  france_medal_count_recent = france_medal_count[(france_medal_count.Edition>1988)&(france_medal_count.Gender=='Women')]
  df_medal_count_recent = df_medal_count[(df_medal_count.Edition>1988)&(df_medal_count.Gender=='Women')]

  france_recent_pct = france_medal_count_recent.groupby(['Discipline']).size()/\
  df_medal_count_recent.groupby(['Discipline']).size()
  df_france_best_disciplines = france_recent_pct.sort_values(ascending=False).reset_index().rename(columns={0:'value'})
  df_france_best_disciplines = df_france_best_disciplines.loc[:9,:]
  df_france_best_disciplines.Discipline = df_france_best_disciplines.Discipline.replace(french_trad)

  logger.info('inserting df with shape: ' + str(df_france_best_disciplines.shape))
  #dataframe_to_mongo(df_france_best_disciplines, DATABASE, 'france_best_disciplines', erase=True)
  #logger.info('insertion sucessful in db' + DATABASE + ' of collection: ' + 'df_france_best_disciplines')

  df_france_best_disciplines.to_json('../../static/viz/summer_olympics/france_best_disciplines_women.json', orient='records')

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

  df_france_best_disciplines.to_json('../../static/viz/summer_olympics/france_best_disciplines_ever.json', orient='records')