PROJECT='summer_olympics'

DATABASE = 'summer_olympics'
#Collections
ECONOMICS = 'wb_demo_eco'

#scrapped domains
SCRAPPED = [
    {
        'file':'2012_winners.json',
        'collection_name':'winners_2012',
        'orient':'records'
    }
]

#static files
STATIC=[
    {
        'file':'Summer Olympic medallists 1896 to 2008.xlsx',
        'type':'excel',
        'collection_name':'winners_1896_2008',
        'sheetname':'ALL MEDALISTS',
        'skiprows':4
    }   
]

#apis params
APIs = [
    {
        'api':'wb',
        'collection_name':'wb_demo_eco',
        'indicator' : ['NY.GDP.MKTP.CD','SP.POP.TOTL'],
        'country' : ['all'],
        'start' : 1960,
        'end' : 2012,
        'col_rename' : {
            'NY.GDP.MKTP.CD':'GDP_cst_dollars',
            'SP.POP.TOTL':'population'
        }
    }
]

COLLECTIONS = ['winners_2012', 'winners_1896_2008', ECONOMICS]