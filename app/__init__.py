from flask import Flask, render_template

app = Flask(__name__)
app.config.from_object('config')
app.TITLE = 'Weekly Toucan'

#a mettre en place : creation auto d'une view pour chaque nouveau projet
#il faut ajouter dans la base mongo, utilities, collec = views
#la db mongo pourrait etre utilisee plus largement pour contenir les param data_params et parameters.js
#data_params peut ensuite etre utilise depuis mongo db sans s'emmerder avec les path

#view = {url:, title:,previous_article:{}, next_article:{}}
#insert existing views in mongo (use indexing)
#build a method to add new article in mongo
#build a method to update previous/next article info(use indexing)
#use below method to build all views based on what's contained in the database ==> complusory to move to full db
#==> do that alternatively, have a json/csv file with that information, and update it as needed (use as a db)

previous_article={'url':'/nobel', 'title':'Prix nobels'}
next_article={}
PROJECT_NAME = 'summer_olympics'

def function_maker(previous_article, next_article, PROJECT_NAME):
    def my_function():
        return render_template(
                               PROJECT_NAME + '.html',
                               previous_article=previous_article,
                               next_article=next_article,
                               title=app.TITLE
                               )
    return my_function

my_index = function_maker(previous_article, next_article, PROJECT_NAME)
app.add_url_rule('/' + PROJECT_NAME, PROJECT_NAME, my_index)

from app import views