// src/lib/schemaLoader.ts

import fallbackEntity from "../schema/presets/entity_schema.json"
import fallbackWorld from "../schema/presets/world_schema.json"
import fallbackScene from "../schema/presets/scene_schema.json"
import fallbackProp from "../schema/presets/prop_schema.json"
import fallbackShot from "../schema/presets/shot_schema.json"
import fallbackEvent from "../schema/presets/event_schema.json"
import { AttributeField } from "../types/FieldTypes"

export const getSchemaForCardType = async (
  type: string,
  universe: string = "ExampleUniverse"
): Promise<AttributeField[]> => {
  try {
    const res = await fetch(`/universe_schemas/${universe}.json`)
    const universeSchema = await res.json()

    if (Array.isArray(universeSchema[type]?.fields)) {
      return universeSchema[type].fields
    }
  } catch (err) {
    console.warn("⚠️ Falling back to default schema:", err)
  }

  // fallback presets
  switch (type) {
    case "character":
      return fallbackEntity as AttributeField[]
    case "world":
      return fallbackWorld as AttributeField[]
    case "scene":
      return fallbackScene as AttributeField[]
    case "prop":
      return fallbackProp as AttributeField[]
    case "shot":
      return fallbackShot as AttributeField[]
    case "event":
      return fallbackEvent as AttributeField[]
    default:
      return []
  }
}
