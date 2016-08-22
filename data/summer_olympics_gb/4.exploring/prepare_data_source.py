#!/usr/bin/env python
# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import pandas as pd
from pymongo import MongoClient
import numpy as np
from data_params import DATABASE, PROJECT, DOMAIN
from mongo_tools import mongo_to_dataframe,dataframe_to_mongo,get_mongo_database,mongo_coll_to_dicts


def my_method():

  df = mongo_to_dataframe(DATABASE, DOMAIN)
  grant_info = mongo_to_dataframe(DATABASE, 'grant_information')
  df_medal_count = df.drop_duplicates(subset=['Edition','Event','Gender','Medal','Discipline'])
  
  # pct by medal
  df_medal_by_country = df_medal_count.groupby(['country_name','Edition','Medal','Discipline']).size()
  df_medal_total = df_medal_count.groupby(['Edition','Medal','Discipline']).size()
  df_medal_by_country = df_medal_by_country.reset_index().rename(columns={0:'country_value'})
  df_medal_total = df_medal_total.reset_index().rename(columns={0:'total_value'})
  df_merged = pd.merge(df_medal_by_country, df_medal_total, on=['Edition','Medal','Discipline'], how='outer')
  df_merged['value'] = df_merged['country_value']/df_merged['total_value']

  #total pct
  df_medal_by_country_detail = df_medal_count.groupby(['country_name','Edition','Discipline']).size()
  df_medal_total_detail = df_medal_count.groupby(['Edition','Discipline']).size()
  df_medal_by_country_detail = df_medal_by_country_detail.reset_index().rename(columns={0:'country_value'})
  df_medal_total_detail = df_medal_total_detail.reset_index().rename(columns={0:'total_value'})
  df_merged_detail = pd.merge(
                              df_medal_by_country_detail,
                              df_medal_total_detail,
                              on=['Edition','Discipline'], how='outer'
                              )
  df_merged_detail['value'] = df_merged_detail['country_value']/df_merged_detail['total_value']
  df_merged_detail['Medal']='All'

  df_france_best_disciplines = pd.concat([df_merged, df_merged_detail])
  # df_france_best_disciplines.Discipline = df_france_best_disciplines.Discipline.replace(french_trad)
  df_france_best_disciplines.set_index(
                                       [c for c in df_france_best_disciplines.columns if c not in ['value','country_value']],
                                       inplace=True
                                       )

  df_france_best_disciplines= df_france_best_disciplines.stack().reset_index().rename(columns={'level_5':'value_filter',0:'value'})
  df_france_best_disciplines.value_filter.replace({'country_value':'Nombre','value':'%'}, inplace=True)

  # add precision
  df_france_best_disciplines.loc[df_france_best_disciplines.value_filter=='Nombre','precision']=',.0f'
  df_france_best_disciplines.loc[df_france_best_disciplines.value_filter=='%','precision']=',.0%'

  #filter for dimension of interests
  df_france_best_disciplines = df_france_best_disciplines[df_france_best_disciplines.country_name.isin(['France','United Kingdom'])]
  df_france_best_disciplines = df_france_best_disciplines[df_france_best_disciplines.Medal.isin(['All','Gold'])]

  #prepare grant info for merge
  grant_info = grant_info[(grant_info.Year>=2011)]
  grant_info['country_name'] = 'United Kingdom'
  RENAME_GRANT = {
      'Modern Pentathlon':'Modern pentathlon'
  }
  grant_info.SPORT = grant_info.SPORT.replace(RENAME_GRANT)
  
  grant_grouped = grant_info.groupby(['country_name','SPORT']).PAID.sum()
  grant_clean = grant_grouped.reset_index().rename(columns={'PAID':'Budget','SPORT':'Discipline'})

  full_data = pd.merge(df_france_best_disciplines, grant_clean, on=['country_name','Discipline'], how='outer')
  full_data.loc[full_data.value.isnull(), 'value'] = 0
  full_data.loc[full_data.Budget.isnull(), 'Budget'] = 0
  
  #budget with no Edition with medal
  full_data.dropna(subset=['Edition'], inplace=True)
  return full_data

def prepare_linechart():
  df = mongo_to_dataframe(DATABASE, 'fullData')

  grouped = df.groupby(['country_name','Edition','Medal', 'value_filter'])['value','total_value'].sum() 
  df = grouped.reset_index()
  num = df.loc[df.value_filter=='Nombre', 'value'] /  df.loc[df.value_filter=='Nombre', 'total_value'] 
  df.loc[df.value_filter=='%', 'value'] = num.tolist()
  df = df[df.Edition >= 1976]
  return df


TO_PREPARE = [
  {'method':my_method,'source_name':'full_data','output_name':'fullData'}
,
  {'method':prepare_linechart,'source_name':'fullData','output_name':'main_linechart'}
]