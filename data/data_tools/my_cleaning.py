from mongo_tools import *

def my_cleaning():
    
    from data_params import DATABASE
    
    import sys
    sys.path.insert(0,'2.cleaning/')
    from my_cleaning_methods import *

    for collection in TO_CLEAN:
        df = mongo_to_dataframe(DATABASE, collection['collection_name'])
        df = collection['method'](df)
        dataframe_to_mongo(df, DATABASE, collection['collection_name'], erase=True)