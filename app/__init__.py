from flask import Flask, render_template

app = Flask(__name__)
app.config.from_object('config')
app.TITLE = 'Weekly Toucan'

#a mettre en place : creation auto d'une view pour chaque nouveau projet
#il faut ajouter dans la base mongo, utilities, collec = views
#view = {url:, title:,previous_article:{}, next_article:{}}

# def my_index():
#     previous_article={'url':'/nobel', 'title':'Prix nobels'}
#     next_article={}
#     return render_template(
#                            'summer_olympics.html',
#                            previous_article=previous_article,
#                            next_article=next_article,
#                            title=app.TITLE
#                            )
# app.add_url_rule('/', 'my_index', my_index)

from app import views