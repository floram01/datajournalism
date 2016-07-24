from pandas_datareader import wb
import pandas
from mongo_tools import *
from my_logger import logger

def api_wb():
    from data_params import PROJECT, DATABASE, APIs

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
        logger.info('inserting df with shape: ' + str(df.shape))
        dataframe_to_mongo(df, DATABASE,params['collection_name'], erase=True)
        logger.info('insertion sucessful in db' + DATABASE + ' of collection: ' + params['collection_name'])
