import pandas as pd

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

#cleaning params
TO_CLEAN = [
    {
        'collection_name':'winners_2012',
        'method':clean_winners_2012
    }
]
