import pandas as pd
from pymongo import MongoClient
import numpy as np

def prepare_data_sources():
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
  france_recent_pct = france_medal_count_recent.groupby(['Discipline']).size()/\
  df_medal_count_recent.groupby(['Discipline']).size()*100
  df_france_best_disciplines = france_recent_pct.sort_values(ascending=True)

  logger.info('inserting df with shape: ' + str(df_france_best_disciplines.shape))
  #dataframe_to_mongo(df_france_best_disciplines, DATABASE, 'france_best_disciplines', erase=True)
  #logger.info('insertion sucessful in db' + DATABASE + ' of collection: ' + 'df_france_best_disciplines')

  df_france_best_disciplines.to_csv('../../static/viz/summer_olympics/france_best_disciplines.csv')