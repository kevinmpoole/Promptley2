// src/lib/schemaSaver.ts
export async function saveSchemaToUniverse(cardType: string, universe: string, schema: any) {
  const res = await fetch(`http://localhost:8000/api/universe/${universe}/schema/${cardType}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(schema),
  })

  if (!res.ok) throw new Error(`Failed to save schema: ${res.statusText}`)
  return await res.json()
}
