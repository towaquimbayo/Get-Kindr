from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/")
def hello_kindr():
    return {"message": "Backend is working!"}
