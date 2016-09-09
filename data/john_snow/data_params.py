PROJECT='john_snow'#shall be the same as the one given when creating the project

DATABASE = 'john_snow'
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
        'file':'my_excel_file.xlsx',
        'type':'excel',
        'collection_name':'my_excel_file_name',
        'sheetname':'my_sheetname',
        'skiprows':'number'
    }
,
    {
        'file':'my_csv.csv',
        'type':'csv',
        'collection_name':'my_csv_name'
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