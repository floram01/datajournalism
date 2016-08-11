#!/usr/bin/env python
import sys
sys.path.insert(0,'ressources/')
from mongo_tools import *
from my_logger import logger

def my_cleaning(PROJECT_NAME):
    sys.path.insert(0,'../' + PROJECT_NAME + '/')
    from data_params import DATABASE
    
    sys.path.insert(0,'../' + PROJECT_NAME + '/2.cleaning/')
    from my_cleaning_methods import *

    for collection in TO_CLEAN:
        df = mongo_to_dataframe(DATABASE, collection['collection_name'])
        df = collection['method'](df)
        logger.info('cleaning ' + collection['collection_name'] + ', with shape: ' + str(df.shape))
        dataframe_to_mongo(df, DATABASE, collection['collection_name'], erase=True)
        logger.info('cleaning of ' + collection['collection_name'] + ' successful, output shape: ' + str(df.shape))

if __name__ == '__main__':
    my_cleaning(sys.argv[1])