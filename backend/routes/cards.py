# backend/routes/cards.py
from fastapi import APIRouter
from pydantic import BaseModel
from fastapi import APIRouter, HTTPException

from pathlib import Path
import json
import os


router = APIRouter()
BASE_PATH = Path(__file__).parent.parent / "universes"

class CardCreate(BaseModel):
    name: str
    cardType: str
    thumbnail: str | None = None
    prompt: str | None = None
    attributes: dict = {}

@router.get("/api/universe/{universe}/cards/{card_type}")
def get_cards(universe: str, card_type: str):
    card_dir = BASE_PATH / universe / card_type
    if not card_dir.exists():
        return []

    cards = []
    for file in card_dir.glob("*.json"):
        with open(file, "r") as f:
            try:
                data = json.load(f)
                cards.append(data)
            except:
                continue
    return cards

@router.post("/api/universe/{universe}/cards/{card_type}")
def create_card(universe: str, card_type: str, card: CardCreate):
    print(f"📩 Incoming card to create: {card.dict()}")
    if not card.name.strip():
        raise HTTPException(status_code=400, detail="Card name is required.")

    universe_path = BASE_PATH / universe / card_type
    universe_path.mkdir(parents=True, exist_ok=True)

    safe_name = card.name.strip().replace(" ", "_").lower()
    file_path = universe_path / f"{safe_name}.json"

    with open(file_path, "w") as f:
        json.dump(card.dict(), f, indent=2)

    return {"status": "success", "file": str(file_path)}


@router.delete("/api/universe/{universe}/cards/{card_type}/{card_name}")
def delete_card(universe: str, card_type: str, card_name: str):
    universe_path = BASE_PATH / universe / card_type
    safe_name = card_name.strip().replace(" ", "_").lower()
    file_path = universe_path / f"{safe_name}.json"

    if not file_path.exists():
        return {"error": "Card not found"}, 404

    try:
        os.remove(file_path)
        return {"status": "deleted"}
    except Exception as e:
        return {"error": str(e)}, 500

