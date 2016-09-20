import pandas as pd
from pymongo import MongoClient
import numpy as np

def my_merge():
  from data_params import DATABASE, DOMAIN
  from mongo_tools import mongo_to_dataframe,dataframe_to_mongo,get_mongo_database,mongo_coll_to_dicts

  #import below all the collections you wish to use for your merge procedure and tranform them in a pd dataframe
  #df_1 = mongo_to_dataframe(DATABASE,'my_collection_1')
  #df_2 = mongo_to_dataframe(DATABASE,'my_collection_2')
  #df_3 = mongo_to_dataframe(DATABASE,'my_collection_3')

  #add your merge steps here
  
  #return a dataframe
  return df_merged  

#reference here your merging functions
#TO_MERGE has to contain the "collection_name" containing the name of the merged data
#and the "method" i.e. python function you have written to build the target data

TO_CLEAN = [
    {
        'collection_name':'my_merged_collection_name',
        'method':my_cleaning_method
    }
]
