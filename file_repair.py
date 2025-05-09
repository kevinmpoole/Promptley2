import json, os
from pathlib import Path

base_path = Path("universes/ExampleUniverse")
types = ["scene", "world", "shot", "prop", "event"]

for card_type in types:
    folder = base_path / card_type
    for file in folder.glob("*.json"):
        try:
            with open(file, "r") as f:
                data = json.load(f)

            updated = False

            if "name" not in data:
                data["name"] = file.stem.replace("_", " ").title()
                updated = True

            if "cardType" not in data:
                data["cardType"] = card_type
                updated = True

            if "attributes" not in data:
                # move other fields into attributes
                attrs = {k: v for k, v in data.items() if k not in ["name", "cardType", "thumbnail", "prompt"]}
                data["attributes"] = attrs
                for k in attrs: data.pop(k)
                updated = True

            if updated:
                with open(file, "w") as f:
                    json.dump(data, f, indent=2)
                print(f"✅ Repaired {file.name}")
        except Exception as e:
            print(f"❌ Failed on {file.name}: {e}")
