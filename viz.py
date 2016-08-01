from flask import Flask, send_from_directory

app=Flask(__name__)

@app.route('/')
def hello():
  return send_from_directory('.','static/viz/summer_olympics/index.html')

if __name__=="__main__":
  app.run(port=8000, debug=True)