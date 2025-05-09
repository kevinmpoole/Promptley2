# backend/routes/prompts.py
print("✅ prompts.py loaded")

from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
import requests
from pathlib import Path
from fastapi.responses import JSONResponse
import json

router = APIRouter()
BASE_PATH = Path(__file__).parent.parent / "universes"

class PromptRequest(BaseModel):
    prompt: str

@router.post("/prompt")
def proxy_prompt(req: PromptRequest):
    """
    Proxy endpoint: forwards the prompt to the remote ComfyUI API
    """
    payload = {
        "prompt": req.prompt,
        "negative_prompt": "",
        "width": 512,
        "height": 512,
        "steps": 30,
        "cfg_scale": 7.0
    }
    try:
        resp = requests.post(
            "https://krh66gwxxg11qz-3000.proxy.runpod.net/txt2img",
            json=payload,
            timeout=120
        )
        resp.raise_for_status()
    except requests.RequestException as e:
        raise HTTPException(status_code=502, detail=str(e))
    return JSONResponse(content=resp.json())

@router.post("/api/build-prompt/")
async def build_prompt(request: "Request"):
    print("💥 HIT /api/build-prompt/")
    data = await request.json()

    universe = data.get("universe")
    character = data.get("character")
    world = data.get("world")
    scene = data.get("scene")
    prop = data.get("prop")
    event = data.get("event")
    shot = data.get("shot")
    action = data.get("action")

    def load_card(card_type, name):
        if not (universe and name):
            return {}
        card_path = BASE_PATH / universe / card_type / f"{name.strip().replace(' ', '_').lower()}.json"
        if not card_path.exists():
            return {}
        with open(card_path, "r") as f:
            return json.load(f)

    char_data = load_card("character", character)
    world_data = load_card("world", world)

    character_snippet = char_data.get("prompt") or char_data.get("name", "")
    world_snippet = world_data.get("prompt") or world_data.get("name", "")

    action_part = f" — {action}" if action else ""
    prompt_text = f"Shot of {character_snippet} in the {world_snippet}{action_part}. 1/8 scale action figure diorama style."

    return JSONResponse(content={"prompt": prompt_text})
