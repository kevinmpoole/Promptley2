# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import requests

app = Flask(__name__)
CORS(app)

COMFYUI_URL = "http://127.0.0.1:8188/api/v1/txt2img"

@app.route("/prompt", methods=["POST"])
def prompt():
    data = request.get_json(force=True)
    prompt = data.get("prompt")
    if not prompt:
        return jsonify({"error": "No prompt provided"}), 400

    resp = requests.post(COMFYUI_URL, json={
        "prompt": prompt,
        "negative_prompt": "",
        "width": 512,
        "height": 512,
        "steps": 30,
        "cfg_scale": 7.0
    }, timeout=60)
    try:
        resp.raise_for_status()
    except Exception:
        return jsonify({"error": resp.text}), resp.status_code
    return jsonify(resp.json()), 200

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=3002)
