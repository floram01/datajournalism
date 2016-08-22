PROJECT='summer_olympics_gb'#shall be the same as the one given when creating the project

DATABASE = 'summer_olympics_gb'
#Collections
DOMAIN = 'full_data'#reference used for inserting in base your merged and cleaned main data

#scrapped domains
SCRAPPED = [
    # {
    #     'file':'my_scrapped_data.json',
    #     'collection_name':'my_scrapped_data',
    #     'orient':'records'
    # }
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
,
    {
        'file':'2012_winners.json',
        'type':'json',
        'collection_name':'winners_2012'
    } 
,  
    {
        'file':'Grant_information.csv',
        'type':'csv',
        'collection_name':'grant_information'
    } 
,  
    {
        'file':'results_france.csv',
        'type':'csv',
        'collection_name':'results_france_2016'
    } 
,  
    {
        'file':'results_gb.csv',
        'type':'csv',
        'collection_name':'results_gb_2016'
    }   
]

#apis params
APIs = [
    {
        'api':'wb',#only one available for now
        'collection_name':'wb_demo_eco',
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