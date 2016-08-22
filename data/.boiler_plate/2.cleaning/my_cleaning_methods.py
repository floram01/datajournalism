import pandas as pd


#reference below all your methods reference below
def my_cleaning_method(df):
    #add here the data_cleaning steps you want to apply to the chosen collection    

    return df

#reference here your cleaning fonctions
#TO_CLEAN has to contain the "collection_name" containing the data you want to clean
#and the "method" i.e. python function you want to apply to it

TO_CLEAN = [
    {
        'collection_name':'my_collection',
        'method':my_cleaning_method
    }
]
