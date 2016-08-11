#!/usr/bin/env python
import sys
sys.path.insert(0,'ressources/')
from mongo_tools import *

def run(PROJECT_NAME):
    sys.path.insert(0,'../' + PROJECT_NAME + '/3.merging/')
    sys.path.insert(0,'../' + PROJECT_NAME + '/')
    from data_params import DATABASE, DOMAIN, PROJECT

    from my_merge import my_merge
    logger.info('starting to merge data for project ' + PROJECT)
    df = my_merge()
    logger.info('inserting df with shape: ' + str(df.shape))
    dataframe_to_mongo(df, DATABASE, DOMAIN, erase=True)
    logger.info('insertion sucessful in db ' + DATABASE + ' of collection: ' + DOMAIN)

if __name__ == '__main__':
    run(sys.argv[1])
