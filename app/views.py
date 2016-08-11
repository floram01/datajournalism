from flask import Flask, send_from_directory, render_template
from app import app

@app.route('/')
# @app.route('/summer_olympics')
def summer_olympic():
    # title="JO 2016 top 10 meilleures disciplines par pays"
    previous_article={'url':'/nobel', 'title':'Prix nobels'}
    next_article={}
    return render_template(
                         'summer_olympics.html',
                         previous_article=previous_article,
                         next_article=next_article,
                         title=app.TITLE
                         )
@app.route('/nobel')
def nobel():
    # title="JO 2016 top 10 meilleures disciplines par pays"
    previous_article={}
    next_article={'url':'/summer_olympics', 'title':"JO 2016 top 10 meilleures disciplines par pays"}
    return render_template(
                         'nobel.html',
                         previous_article=previous_article,
                         next_article=next_article,
                         title=app.TITLE
                         )