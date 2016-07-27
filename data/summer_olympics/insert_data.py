import sys

sys.path.insert(0, "../data_tools/")
from mongo_tools import *


if __name__ == '__main__':
    # insert_scrapped_in_mongo()
    #insert_static_in_mongo()
    insert_country_maping()
