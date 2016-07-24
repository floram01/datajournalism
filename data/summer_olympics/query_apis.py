import pandas as pd
from pymongo import MongoClient
import numpy as np
from pandas import DataFrame
import sys
from pandas_datareader import wb

sys.path.insert(0, "../data_tools/")
from mongo_tools import *
from my_apis import api_wb


if __name__ == '__main__':
    api_wb()