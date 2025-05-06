export type Attribute = {
  key: string
  label: string
  type: "text" | "number" | "select" | "toggle" | "group"
  options?: string[]
  children?: Attribute[]
  required?: boolean
}

export async function loadSchema(
  cardType: string,
  universe: string = "ExampleUniverse"
): Promise<Attribute[]> {
  try {
    // Try loading universe-specific override
    const universeRes = await fetch(
      `/src/schema/universe_schemas/${universe}.json`
    )
    const universeData = await universeRes.json()

    if (universeData[cardType]) {
      console.log(`Loaded schema for ${cardType} from universe override.`)
      return universeData[cardType]
    }

    throw new Error("No override, fallback to preset")
  } catch (err) {
    // Fall back to default preset
    const presetRes = await fetch(`/src/schema/presets/${cardType}.json`)
    const presetData = await presetRes.json()

    console.log(`Loaded schema for ${cardType} from preset.`)
    return presetData
  }
}
