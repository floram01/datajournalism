from flask import Flask, render_template
import pandas as pd
import sys

sys.path.insert(0,'app/')

app = Flask(__name__)
app.config.from_object('config')
app.TITLE = 'Weekly Toucan'


def function_maker(previous_article, next_article, template_name):
    def my_function():
        return render_template(
                               template_name,
                               previous_article=previous_article,
                               next_article=next_article,
                               title=app.TITLE
                               )
    return my_function

#attention remplacer na par une valeur qui en vanilla python est false
df = pd.read_csv('app/archive.csv')
df.loc[df.previous_url.isnull(),'previous_url'] = df.loc[df.previous_url.isnull(),'project_name']
df.loc[df.next_url.isnull(),'next_url'] = df.loc[df.next_url.isnull(),'project_name']

for i in df.index :
    project_name = df.loc[:, 'project_name'][i]
    template_name = df.loc[:, 'template_name'][i]
    previous_url = df.loc[:, 'previous_url'][i]
    next_url = df.loc[:, 'next_url'][i]
    
    app.add_url_rule(
                     '/' + project_name,
                     project_name,
                     function_maker(previous_url, next_url, template_name)
                     )

latest_id = df.index[-1]
template_name = df.loc[:, 'template_name'][latest_id]
previous_url = df.loc[:, 'previous_url'][latest_id]
next_url = df.loc[:, 'next_url'][latest_id]

app.add_url_rule(
                 '/',
                 'latest',
                 function_maker(previous_url, next_url, template_name)
                 )

from app import views