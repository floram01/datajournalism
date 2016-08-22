#!/usr/bin/env python
import sys
sys.path.insert(0,'ressources/')
from mongo_tools import *

def run(PROJECT_NAME):
    sys.path.insert(0,'../' + PROJECT_NAME + '/3.merging/')
    sys.path.insert(0,'../' + PROJECT_NAME + '/')
    from data_params import DATABASE, DOMAIN, PROJECT

    from my_merge import my_merge, TO_MERGE

    for collection in TO_MERGE:
        df = collection['method']()
        logger.info('Successful merge to ' + collection['collection_name'] + ', with shape: ' + str(df.shape))
        dataframe_to_mongo(df, DATABASE, collection['collection_name'], erase=True)
        logger.info('Successful insertion of ' + collection['collection_name'])

if __name__ == '__main__':
    run(sys.argv[1])
