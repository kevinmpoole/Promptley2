# server.py
import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import openai

app = Flask(__name__)
CORS(app)  # allow any origin

# Make sure you set OPENAI_API_KEY in your environment
openai.api_key = os.getenv("OPENAI_API_KEY")
if not openai.api_key:
    raise RuntimeError("Please set OPENAI_API_KEY")

@app.route("/prompt", methods=["POST"])
def prompt():
    data = request.json or {}
    prompt = data.get("prompt", "").strip()
    if not prompt:
        return jsonify({"error": "No prompt provided"}), 400

    try:
        resp = openai.Image.create(
            prompt=prompt,
            n=1,
            size="512x512"
        )
        url = resp["data"][0]["url"]
        return jsonify({"url": url}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    # Listen on port 3000 (you’ll map it to 8188)
    app.run(host="0.0.0.0", port=3000)
