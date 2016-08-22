import pandas as pd
import numpy as np


#reference below all your methods reference in the TO_CLEAN list below
def clean_winners_2012(df):
    
    #drop the TBC for France prices
    df = df[df.medal != 'TBC']
    #adjust dates and convert to datetime
    try:
        df.date = df.date.str.replace('00000000','')
        df.date = df.date.str.replace('-0000','')
    except:
        pass
    df.date = pd.to_datetime(df.date,errors='coerce')
    #clean country code
    df.country_code = df.country_code.str.replace('(','')
    df.country_code = df.country_code.str.replace(')','')
    #clean medals
    df.medal = df.medal.str.replace(' !','')
    #replace NaT by 0 to export via pymongo
    df.loc[df.date.isnull(),'date']=0

    return df

def clean_grant_info(df):
    df['DATE']=pd.to_datetime(df.DATE,errors='coerce')
    df['Year'] = df.DATE.map(lambda x : x.year)

    df.dropna(subset=['Year'],inplace=True)

    df.PAID = df.PAID.str.replace(',','')
    df.PAID = df.PAID.astype(np.float32, raise_on_error=False, copy=False)

    df_alloc = df.copy()
    df_alloc = df_alloc[(df_alloc.SPORT.notnull())&(df_alloc.SPORT != 'EIS')]

    HANDICAP = r'Wheelchair|Weelchair|Paralympic|Para|Disability|Impaired|Adaptive|Boccia|Goalball'
    WINTER = r'Bobsleigh|Ski|Snow|Curling|Skeleton|Skating'

    df_alloc.loc[df_alloc.SPORT.str.contains(HANDICAP),'category'] = 'Paralympic' 
    df_alloc.loc[df_alloc.SPORT.str.contains(WINTER),'category'] = 'Winter'
    df_alloc.loc[df_alloc.category.isnull(),'category'] = 'Summer'

    df_summer = df_alloc.copy()
    df_summer = df_summer[df_summer.category=='Summer']
    del df_summer['category']

    RENAME = {
    "Gymnastics - Women's Artistic":'Gymnastics',
    "Gymnastics - Men's Artistic":'Gymnastics',
    'Target Shooting':'Shooting',
    'Table Tennis (GB)':'Table Tennis'
    }

    df_summer.SPORT = df_summer.SPORT.replace(RENAME)

    return df_summer

#reference here your cleaning fonctions
#TO_CLEAN has to contain the "collection_name" containing the data you want to clean
#and the "method" i.e. python function you want to apply to it

TO_CLEAN = [
    {
        'collection_name':'winners_2012',
        'method':clean_winners_2012
    }
,
    {
        'collection_name':'grant_information',
        'method':clean_grant_info
    }
]