from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import requests, os, logging

app = Flask(__name__, static_folder="../public", static_url_path="")
CORS(app)  # if you need CORS locally

# Serve the UI
@app.route("/")
def index():
    return app.send_static_file("index.html")
