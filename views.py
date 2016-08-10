from flask import Flask, send_from_directory, render_template
from app import app

@app.route('/')
def last_article():
  return render_template('nobel.html')

# @app.route('/')
# def previous_article():
#   return render_template('nobel.html')
