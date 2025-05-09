def build_frame_prompt(frame_card: dict, all_cards: list) -> dict:
    def get_card(name: str, type_: str) -> dict:
        for c in all_cards:
            if c.get("name") == name and c.get("cardType") == type_:
                return c
        return {}

    used_names = []
    components = []

    # Define which card types we want to include and the fields we care about
    component_types = {
        "character": ["prompt", "attributes"],
        "world": ["prompt", "attributes"],
        "scene": ["prompt", "attributes"],
        "prop": ["prompt", "attributes"],
        "event": ["prompt", "attributes"],
        "shot": ["prompt", "attributes"]
    }

    for ctype, fields in component_types.items():
        name = frame_card.get("attributes", {}).get(ctype)
        if not name:
            continue
        card = get_card(name, ctype)
        if card:
            used_names.append(name)
            for field in fields:
                val = card.get(field)
                if isinstance(val, str):
                    components.append(val)
                elif isinstance(val, dict):
                    components.append(" ".join(f"{k}: {v}" for k, v in val.items() if v))

    compiled_prompt = ", ".join([c for c in components if c])

    return {
        "compiled_prompt": compiled_prompt,
        "used_cards": used_names
    }
