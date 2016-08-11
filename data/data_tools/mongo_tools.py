import pandas as pd
from pymongo import MongoClient
import numpy as np
from pandas import DataFrame
import sys
from my_logger import logger


def insert_static_in_mongo():
    from data_params import PROJECT, STATIC, DATABASE
    #insert path to scrapped data
    common_path = "1.getting the data/3.static_files/"
    #insert each scrapped file in mongodb
    for file in STATIC:
        logger.info('inserting static data')
        if file['type'] == 'csv':
            df = read_csv(common_path + file['file'])
        elif file['type'] == 'excel':
            df = pd.read_excel(
                            common_path + file['file'],
                            sheetname=file['sheetname'],
                            skiprows=file['skiprows']
                            )
        logger.info('inserting df with shape: ' + str(df.shape))
        dataframe_to_mongo(df, DATABASE,file['collection_name'], erase=True)
        logger.info('insertion sucessful in db' + DATABASE + ' of collection: ' + file['collection_name'])

def insert_file_in_mongo(file, DATABASE='utilities', collection_name='country_code'):
    logger.info('inserting' + file['name'])
    if file['type'] == 'csv':
        df = pd.read_csv(file['name'])
    elif file['type'] == 'excel':
        df = pd.read_excel(
                        file['name'],
                        sheetname=file['sheetname'],
                        skiprows=file['skiprows']
                        )
    logger.info('inserting df with shape: ' + str(df.shape))
    dataframe_to_mongo(df, DATABASE,collection_name, erase=True)
    logger.info('insertion sucessful in db ' + DATABASE + ' of collection ' + collection_name)

def insert_scrapped_in_mongo():
    from data_params import PROJECT, SCRAPPED, DATABASE
    #insert path to scrapped data
    common_path = "1.getting the data/1.scrapping/" + PROJECT + '/'
    #insert each scrapped file in mongodb
    for file in SCRAPPED:
        logger.info('inserting scraped data')
        df = pd.read_json(open(common_path + file['file']), orient=file['orient'])
        logger.info('inserting df with shape: ' + str(df.shape))
        dataframe_to_mongo(df, DATABASE,file['collection_name'], erase=True)
        logger.info('insertion sucessful in db' + DATABASE + ' of collection: ' + file['collection_name'])

def insert_country_maping():
    from data_params import DATABASE

    df = pd.read_csv('country_code.csv')
    dataframe_to_mongo(df, DATABASE,'country_mapper', erase=True)

def get_mongo_database(db_name, host='localhost',
                       port=27017, username=None, password=None):
    """
     Get named database from MongoDB with/out authentication
     """
    if username and password:
        mongo_uri = 'mongodb://%s:%s@%s/%s'%(username, password, host, db_name)
        conn = MongoClient(mongo_uri)
    else:
        conn = MongoClient(host, port)

    return conn[db_name]

def mongo_coll_to_dicts(dbname='test', collname='test',
                        query={}, del_id=True, **kw): 

    db = get_mongo_database(dbname, **kw)
    res = list(db[collname].find(query))

    if del_id:
        for r in res:
            r.pop('_id')

    return res

def mongo_to_dataframe(db_name, collection, query={},
                       host='localhost', port=27017,
                       username=None, password=None, no_id=True):
    """
     create a dataframe from mongodb collection
     """
    db = get_mongo_database(db_name, host, port, username, password)
    cursor = db[collection].find(query)
    df =  pd.DataFrame(list(cursor))

    if no_id: 
        del df['_id']

    return df

def dataframe_to_mongo(df, db_name, collection,
                       host='localhost', port=27017,
                       username=None, password=None, erase=False):
    """
    save a dataframe to mongodb collection
    """
    db = get_mongo_database(db_name, host, port, username, password)
    records = df.to_dict('records')
    if erase:
        db.drop_collection(collection)
    db[collection].insert_many(records)