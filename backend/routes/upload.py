from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from pathlib import Path
import shutil
import uuid

router = APIRouter()

@router.post("/api/universe/{universe}/upload-thumbnail/")
async def upload_thumbnail(universe: str, file: UploadFile = File(...)):
    try:
        ext = Path(file.filename).suffix
        base = Path(file.filename).stem
        unique_name = f"{base}_{uuid.uuid4().hex[:8]}{ext}"
        
        # Correct save location: inside universe folder
        universe_thumb_dir = Path(__file__).parent.parent / "universes" / universe / "thumbnails"
        universe_thumb_dir.mkdir(parents=True, exist_ok=True)
        save_path = universe_thumb_dir / unique_name

        with open(save_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        print(f"✅ Thumbnail saved: {save_path}")
        print(f"🧠 Returning relative path: {universe}/thumbnails/{unique_name}")
        return {"filename": f"{universe}/thumbnails/{unique_name}"}
    except Exception as e:
        print(f"❌ UPLOAD ERROR: {e}")
        raise HTTPException(status_code=500, detail=str(e))
