#!/usr/bin/env bash
set -euo pipefail

echo "🔧 Installing ComfyUI‑API extension…"
git clone https://github.com/BasuC/ComfyUI-API.git /workspace/comfyui/extensions/ComfyUI-API

echo "🔧 Installing proxy dependencies…"
pip install flask flask-cors requests

echo "🚀 Launching ComfyUI HTTP API…"
cd /workspace/comfyui
# background it so the script continues
python3 main.py \
  --listen 0.0.0.0 \
  --port 8188 \
  --enable-cors-header &

# give ComfyUI a moment to bind
sleep 5

echo "🚀 Launching Flask proxy…"
cd /workspace
python3 app.py
