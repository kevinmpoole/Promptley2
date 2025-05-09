from fastapi import FastAPI, Request, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from pathlib import Path
from PIL import Image
from backend.routes import cards
import shutil
import json
import os
import uuid

print("🔥 Running backend/main.py")

# === Constants ===
BASE_PATH = Path(__file__).parent / "universes"
THUMBNAIL_DIR = Path(__file__).parent / "uploads"
THUMBNAIL_DIR.mkdir(parents=True, exist_ok=True)

# === App ===
app = FastAPI()
app.mount("/universes", StaticFiles(directory=BASE_PATH), name="universes")

# === Mount Static Thumbnail Access ===
app.mount("/thumbnails", StaticFiles(directory=THUMBNAIL_DIR), name="thumbnails")

# === CORS ===
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# === Import and Include Routers ===
from backend.routes import upload
from backend.routes import prompts
from backend.routes import universes

app.include_router(upload.router)
app.include_router(prompts.router)
app.include_router(universes.router)
app.include_router(cards.router)

# === Models ===
class CardCreate(BaseModel):
    name: str
    cardType: str
    thumbnail: str | None = None
    prompt: str | None = None
    attributes: dict = {}

# === Routes ===
@app.get("/api/universe/{universe}/cards/{card_type}")
def get_cards(universe: str, card_type: str):
    card_dir = BASE_PATH / universe / card_type
    print(f"📁 Looking in: {card_dir}")
    if not card_dir.exists():
        print("🚫 Directory not found.")
        return []

    cards = []
    for file_path in card_dir.glob("*.json"):
        try:
            with open(file_path, "r") as f:
                data = json.load(f)
                if "name" in data and "cardType" in data:
                    data["id"] = file_path.stem
                    cards.append(data)
                else:
                    print(f"⚠️ Invalid card schema in {file_path}")
        except Exception as e:
            print(f"❌ Failed to load {file_path}: {e}")
    print(f"✅ Loaded {len(cards)} cards")
    return cards

@app.get("/api/universes")
def list_universes():
    universe_names = [f.name for f in BASE_PATH.iterdir() if f.is_dir()]
    return {"universes": universe_names}

@app.post("/api/universe/{universe}/cards/{card_type}")
def create_card(universe: str, card_type: str, card: CardCreate):
    universe_path = BASE_PATH / universe / card_type
    universe_path.mkdir(parents=True, exist_ok=True)

    # Handle thumbnail if base64 is provided
    thumbnail_rel_path = None
    if card.thumbnail and card.thumbnail.startswith("data:image"):
        import base64
        import re

        # Create thumbnails dir inside universe
        thumb_dir = BASE_PATH / universe / "thumbnails"
        thumb_dir.mkdir(parents=True, exist_ok=True)

        # Extract base64 data
        match = re.match(r"data:image/(\w+);base64,(.*)", card.thumbnail)
        if match:
            ext = match.group(1)
            data = base64.b64decode(match.group(2))
            safe_name = card.name.strip().replace(" ", "_").lower()
            thumb_filename = f"{safe_name}.{ext}"
            thumbnail_path = thumb_dir / thumb_filename
            with open(thumbnail_path, "wb") as f:
                f.write(data)
            thumbnail_rel_path = f"./thumbnails/{thumb_filename}"
        else:
            print("⚠️ Failed to parse thumbnail base64")

    # Build clean card data
    clean_card = {
        "name": card.name,
        "cardType": card.cardType,
        "prompt": card.prompt,
        "attributes": card.attributes,
        "thumbnail": thumbnail_rel_path
    }

    safe_name = card.name.strip().replace(" ", "_").lower()
    file_path = universe_path / f"{safe_name}.json"
    with open(file_path, "w") as f:
        json.dump(clean_card, f, indent=2)

    print(f"✅ Saved card to: {file_path}")
    return {"status": "success", "file": str(file_path)}

@app.post("/api/universe/{universe}/schema/{card_type}")
async def save_schema(universe: str, card_type: str, request: Request):
    data = await request.json()
    universe_schema_path = BASE_PATH / universe
    universe_schema_path.mkdir(parents=True, exist_ok=True)
    schema_file = universe_schema_path / f"{universe}.json"

    if schema_file.exists():
        with open(schema_file, "r") as f:
            universe_data = json.load(f)
    else:
        universe_data = {}

    universe_data[card_type] = data

    with open(schema_file, "w") as f:
        json.dump(universe_data, f, indent=2)

    return {"status": "success", "message": f"Saved {card_type} schema"}

@app.get("/api/universe/{universe}/timeline")
def get_timeline(universe: str):
    path = BASE_PATH / universe / "timeline.json"
    if path.exists():
        with open(path, "r") as f:
            return json.load(f)
    return []

@app.post("/api/universe/{universe}/timeline")
async def save_timeline(universe: str, request: Request):
    data = await request.json()
    path = BASE_PATH / universe
    path.mkdir(parents=True, exist_ok=True)
    with open(path / "timeline.json", "w") as f:
        json.dump(data, f, indent=2)
    return JSONResponse(content={"status": "success"})

