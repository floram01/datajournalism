#!/usr/bin/env python
import sys
sys.path.insert(0,'ressources/')
sys.path.insert(0,'ressources/')
from mongo_tools import *
from my_logger import logger

def create_data_source(PROJECT_NAME):
    sys.path.insert(0,'../' + PROJECT_NAME + '/')
    from data_params import DATABASE, DOMAIN
    
    sys.path.insert(0,'../' + PROJECT_NAME + '/4.exploring/')
    from prepare_data_source import TO_PREPARE

    sys.path.insert(0, "../../app/static/" + PROJECT_NAME + "/")

    from my_logger import logger

    for collection in TO_PREPARE:
        df = collection['method']()

        logger.info(
                    'creating domain: ' + collection['output_name'] + ' for project ' + PROJECT_NAME +', domain shape is: ' + str(df.shape)
                    )
        df.to_json('../../app/static/viz/' + PROJECT_NAME + '/data_sources/' + collection['output_name'] + '.json', orient='records')
        logger.info('domain successfuly created')
        dataframe_to_mongo(df, DATABASE, collection['output_name'], erase=True)
        logger.info('domain successfuly inserted')

if __name__ == '__main__':
    create_data_source(sys.argv[1])
