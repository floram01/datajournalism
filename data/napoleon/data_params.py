PROJECT='napoleon'#shall be the same as the one given when creating the project

DATABASE = 'napoleon'
#Collections
DOMAIN = 'full_data'#reference used for inserting in base your merged and cleaned main data

#scrapped domains
SCRAPPED = [
    {
        'file':'my_scrapped_data.json',
        'collection_name':'my_scrapped_data',
        'orient':'records'
    }
]

#static files
STATIC=[
    {
        'file':'troops.csv',
        'type':'csv',
        'collection_name':'troops',
        'sep':r"\s+"
    }
,   
    {
        'file':'temps.csv',
        'type':'csv',
        'collection_name':'temps',
        'sep':r"\s+"
    }
,   
    {
        'file':'cities.csv',
        'type':'csv',
        'collection_name':'cities',
        'sep':r"\s+"
    }   
]

#apis params
APIs = [
    {
        'api':'wb',#only one available for now
        'collection_name':'my_extraction_name',
        #see the wb site for full list of indicators available http://data.worldbank.org/indicator
        'indicator' : ['NY.GDP.MKTP.CD','SP.POP.TOTL'],
        ##see the wb site for full list of indicators available http://data.worldbank.org/country
        'country' : ['all'],
        'start' : 1960,
        'end' : 2012,
        #use this to rename the wb indicators column header into more friendly ones
        'col_rename' : {
            'NY.GDP.MKTP.CD':'GDP_cst_dollars',
            'SP.POP.TOTL':'population'
        }
    }
]