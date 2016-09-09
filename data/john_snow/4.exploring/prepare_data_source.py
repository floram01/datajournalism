#!/usr/bin/env python
# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import pandas as pd
from pymongo import MongoClient
import numpy as np


def prepare_data_source():
  df = my_method()
  return df

def my_method():
  from data_params import DATABASE, PROJECT, DOMAIN
  from mongo_tools import mongo_to_dataframe,dataframe_to_mongo,get_mongo_database,mongo_coll_to_dicts
  from shape_tools import *

  #import your merged and cleaned data ready to be shaped!
  df = mongo_to_dataframe(DATABASE, DOMAIN)

  return df_shaped
