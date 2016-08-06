from flask import Flask, send_from_directory, render_template

app=Flask(__name__)

@app.route('/')
def main():
  return send_from_directory('.','static/viz/summer_olympics/index.html')

if __name__=="__main__":
  debug=True