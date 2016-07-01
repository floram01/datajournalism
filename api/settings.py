# api/settings.py

# Optional MONGO variables
#MONGO_HOST = 'localhost'
#MONGO_PORT = 27017
#MONGO_USERNAME = 'user'
#MONGO_PASSWORD = 'user'

X_DOMAINS = 'http://localhost:8000'

#fixer le format de date, quand on ajoute le champ de data ==> bug
URL_PREFIX = 'api'
MONGO_DBNAME = 'nobel_prize'
DOMAIN = {
'full_data':{
    'schema':{              
        'country':{'type':'string'},
        'category':{'type':'string'},
        'name':{'type':'string'},
        'year':{'type': 'integer'},
        'gender':{'type':'string'},
        'mini_bio':{'type':'string'},
        'image_urls':{'type':'list'},
        # 'date_of_birth':{'type':'string'}
     }
}}

# HATEOAS=False
#False to display all results at once (vs number of results per page)
PAGINATION=False