from pandas_datareader import wb
import pandas as pd
from mongo_tools import *
from my_logger import logger

def query_apis():
    from data_params import APIs

    for params in APIs:
        logger.info('requesting api: ' + params['api'])
        if params['api'] == 'wb':
            api_wb(params)


def api_wb(params):
    from data_params import DATABASE
    country_codes = mongo_to_dataframe('utilities', 'country_code')

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