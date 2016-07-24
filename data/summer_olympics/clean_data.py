import sys


sys.path.insert(0, "../data_tools/")
# from mongo_tools import *
from my_cleaning import my_cleaning

if __name__ == '__main__':
    my_cleaning()
