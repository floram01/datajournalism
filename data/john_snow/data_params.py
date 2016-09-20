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
    }
]