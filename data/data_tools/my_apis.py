from pandas_datareader import wb
import pandas as pd
from mongo_tools import *
from my_logger import logger

def api_wb():
    from data_params import PROJECT, DATABASE, APIs
    country_codes = pd.read_csv('country_code.csv')

    for params in APIs:
        logger.info('requesting api: ' + params['api'])
        if params['api'] == 'wb':
            df = wb.download(
                             indicator=params['indicator'],
                             country=params['country'],
                             start=params['start'],
                             end=params['end']
                             )
            df = df.reset_index()
            df.rename(columns=params['col_rename'], inplace=True)
            df = pd.merge(df,country_codes, left_on='country',right_on='country_name')
            df = df[['GDP_cst_dollars','ISO3','population','year']]
    
        logger.info('inserting df with shape: ' + str(df.shape))
        dataframe_to_mongo(df, DATABASE,params['collection_name'], erase=True)
        logger.info('insertion sucessful in db' + DATABASE + ' of collection: ' + params['collection_name'])
