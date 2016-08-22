#!/usr/bin/env python
import sys
sys.path.insert(0,'ressources/')

def create_data_source(PROJECT_NAME):
    sys.path.insert(0,'../' + PROJECT_NAME + '/')
    from data_params import DATABASE, DOMAIN
    
    sys.path.insert(0,'../' + PROJECT_NAME + '/4.exploring/')
    from prepare_data_source import prepare_data_source

    sys.path.insert(0, "../../app/static/" + PROJECT_NAME + "/")

    from my_logger import logger

    df = prepare_data_source()

    logger.info(
                'creating domain: ' + DOMAIN + ' for project ' + PROJECT_NAME +', domain shape is: ' + str(df.shape)
                )
    df.to_json('../../app/static/viz/' + PROJECT_NAME + '/data_sources/fullData.json', orient='records')
    logger.info('domain successfuly created')

if __name__ == '__main__':
    create_data_source(sys.argv[1])
