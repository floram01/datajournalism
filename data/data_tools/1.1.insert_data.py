#!/usr/bin/env python
import sys
sys.path.insert(0,'ressources/')
from mongo_tools import *

def run(PROJECT_NAME):
    sys.path.insert(0,'../' + PROJECT_NAME + '/')
    #add a test, if there is a scrapping flag in data_params then insert_scrapped else pass
    insert_scrapped_in_mongo()
    
    insert_static_in_mongo()
    # insert_file_in_mongo({'name':'country_code.csv','type':'csv'})
  

if __name__ == '__main__':
    run(sys.argv[1])
