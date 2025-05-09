import json
import requests

universe = "ExampleUniverse"
endpoint = f"http://localhost:8000/api/universe/{universe}/cards/shot"

shot_cards = [
    {
        "name": "Establishing Wide Shot",
        "cardType": "shot",
        "attributes": {
            "description": "A wide landscape shot introducing the scene environment.",
            "camera": {"angle": "wide", "type": "establishing", "movement": "static"},
            "expression": "Neutral"
        }
    },
    {
        "name": "Close-Up Reaction",
        "cardType": "shot",
        "attributes": {
            "description": "A tight close-up of a character’s emotional reaction.",
            "camera": {"angle": "frontal", "type": "close-up", "movement": "static"},
            "expression": "Surprised",
            "charactersInFrame": ["Seamus O’Brine"]
        }
    },
    {
        "name": "Over-the-Shoulder",
        "cardType": "shot",
        "attributes": {
            "description": "Over-the-shoulder shot showing one character's view.",
            "camera": {"angle": "OTS", "type": "medium", "movement": "static"},
            "expression": "Attentive"
        }
    },
    {
        "name": "Tracking Action Shot",
        "cardType": "shot",
        "attributes": {
            "description": "Camera follows a character running or performing an action.",
            "camera": {"angle": "side", "type": "full-body", "movement": "tracking"},
            "expression": "Determined"
        }
    },
    {
        "name": "Low-Angle Power Shot",
        "cardType": "shot",
        "attributes": {
            "description": "Low-angle shot to emphasize power or threat.",
            "camera": {"angle": "low", "type": "medium", "movement": "static"},
            "expression": "Intimidating"
        }
    },
    {
        "name": "High-Angle Vulnerability",
        "cardType": "shot",
        "attributes": {
            "description": "High-angle shot making subject appear small or vulnerable.",
            "camera": {"angle": "high", "type": "medium", "movement": "static"},
            "expression": "Worried"
        }
    },
    {
        "name": "Two-Shot Dialogue",
        "cardType": "shot",
        "attributes": {
            "description": "Two characters in frame mid-conversation.",
            "camera": {"angle": "eye-level", "type": "two-shot", "movement": "static"},
            "expression": "Conversational",
            "charactersInFrame": ["Buckley Blackwell", "Seamus O’Brine"]
        }
    },
    {
        "name": "Drone Aerial Overview",
        "cardType": "shot",
        "attributes": {
            "description": "Aerial view of a location from above.",
            "camera": {"angle": "top-down", "type": "aerial", "movement": "flyover"},
            "expression": "Neutral"
        }
    },
    {
        "name": "Whip-Pan Transition",
        "cardType": "shot",
        "attributes": {
            "description": "Fast camera movement for dramatic scene transition.",
            "camera": {"angle": "horizontal", "type": "medium", "movement": "whip-pan"},
            "expression": "Blurry"
        }
    },
    {
        "name": "Hero Frontal Slow-Mo",
        "cardType": "shot",
        "attributes": {
            "description": "Frontal hero shot in slow motion.",
            "camera": {"angle": "frontal", "type": "medium", "movement": "slow-motion"},
            "expression": "Heroic"
        }
    }
]

for card in shot_cards:
    response = requests.post(endpoint, json=card)
    print(f"Created {card['name']}: {'✅' if response.ok else '❌'}")
