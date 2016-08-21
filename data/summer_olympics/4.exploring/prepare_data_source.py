#!/usr/bin/env python
# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import pandas as pd
from pymongo import MongoClient
import numpy as np


def prepare_data_source():
  df = assemble_periods()
  return df

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

def assemble_periods():
  df_1 = results_by_disciplines_and_period([1992,2012],'1992 - 2012')
  df_2 = results_by_disciplines_and_period([2012,2012],'2012')
  df_3 = results_by_disciplines_and_period([1896,2012],'1896 - 2012')
  
  df = pd.concat([df_1, df_2, df_3])
  return df  

def results_by_disciplines_and_period(period,period_name):
  from data_params import DATABASE, PROJECT, DOMAIN
  from mongo_tools import mongo_to_dataframe,dataframe_to_mongo,get_mongo_database,mongo_coll_to_dicts

  df = mongo_to_dataframe(DATABASE, DOMAIN)

  df_medal_count = df.drop_duplicates(subset=['Edition','Event','Gender','Medal','Discipline'])
  df_medal_count_recent = df_medal_count[(df_medal_count.Edition>=period[0])&(df_medal_count.Edition<=period[1])]
  
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
  # df_france_best_disciplines.Discipline = df_france_best_disciplines.Discipline.replace(french_trad)
  df_france_best_disciplines.set_index(
                                       [c for c in df_france_best_disciplines.columns if c not in ['value','country_value']],
                                       inplace=True
                                       )
  df_france_best_disciplines= df_france_best_disciplines.stack().reset_index().rename(columns={'level_4':'value_filter',0:'value'})
  df_france_best_disciplines.value_filter.replace({'country_value':'Nombre','value':'%'}, inplace=True)

  # add precision
  df_france_best_disciplines.loc[df_france_best_disciplines.value_filter=='Nombre','precision']=',.0f'
  df_france_best_disciplines.loc[df_france_best_disciplines.value_filter=='%','precision']=',.0%'

  #add period column
  df_france_best_disciplines['period']=period_name

  return df_france_best_disciplines
