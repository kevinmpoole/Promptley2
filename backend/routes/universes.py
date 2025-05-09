from fastapi import APIRouter, HTTPException, Request
from pathlib import Path
import json
import os

router = APIRouter()
BASE_PATH = Path("backend/universes")

@router.post("/api/universe/create")
async def create_universe(request: Request):
    data = await request.json()
    universe_name = data.get("name")

    if not universe_name:
        raise HTTPException(status_code=400, detail="Universe name is required.")

    safe_name = universe_name.strip().replace(" ", "_")
    universe_path = BASE_PATH / safe_name

    if universe_path.exists():
        raise HTTPException(status_code=400, detail="Universe already exists.")

    try:
        # Create base universe directory and card type subfolders
        universe_path.mkdir(parents=True)
        for card_type in ["character", "world", "scene", "prop", "shot", "event", "frame"]:
            (universe_path / card_type).mkdir(exist_ok=True)

        # Create an empty schema file
        with open(universe_path / f"{safe_name}.json", "w") as f:
            json.dump({}, f)

        return {"status": "success", "universe": safe_name}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating universe: {str(e)}")
