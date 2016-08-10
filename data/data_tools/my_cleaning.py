#!/usr/bin/env python
from mongo_tools import *
import sys

def my_cleaning(PROJECT_NAME):
    sys.path.insert(0,'../' + PROJECT_NAME + '/')
    from data_params import DATABASE
    
    sys.path.insert(0,'../' + PROJECT_NAME + '/2.cleaning/')
    from my_cleaning_methods import *

    for collection in TO_CLEAN:
        df = mongo_to_dataframe(DATABASE, collection['collection_name'])
        df = collection['method'](df)
        dataframe_to_mongo(df, DATABASE, collection['collection_name'], erase=True)

if __name__ == '__main__':
    my_cleaning(sys.argv[1])