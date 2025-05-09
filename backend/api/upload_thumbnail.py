# backend/routes/upload_thumbnail.py

xxfrom fastapi import APIRouter, UploadFile, File, HTTPException
from pathlib import Path
import shutil
import uuid
import os

router = APIRouter()
BASE_DIR = Path(__file__).parent.parent / "universes"

@router.post("/api/universe/{universe}/upload-thumbnail/")
async def upload_thumbnail(universe: str, file: UploadFile = File(...)):
    universe_thumb_dir = BASE_DIR / universe / "thumbnails"
    universe_thumb_dir.mkdir(parents=True, exist_ok=True)

    # Get original filename extension
    ext = os.path.splitext(file.filename)[1]

    # Optional: require the card name to be passed for saving
    # Let's assume you add a `cardName` in the request query or form
    form = await file.read()
    safe_name = "temp_thumbnail"  # fallback default if cardName isn't sent

    if "cardname" in file.filename.lower():
        safe_name = file.filename.lower().replace(" ", "_").split(".")[0]
    else:
        safe_name = file.filename.lower().replace(" ", "_").split(".")[0]

    filename = f"{safe_name}{ext}"
    file_path = universe_thumb_dir / filename

    with open(file_path, "wb") as buffer:
        buffer.write(form)

    return {"filename": filename}

