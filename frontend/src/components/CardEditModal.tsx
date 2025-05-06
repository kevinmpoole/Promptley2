
import { CardType } from "../types/CardTypes"

interface AttributeField {
  key: string
  label: string
  type: string
  required?: boolean
  options?: string[]
  children?: AttributeField[]
}

interface Card {
  name: string
  cardType: CardType
  world?: string
  baseCharacterName?: string
  isBase?: boolean
  attributes?: Record<string, any>
  thumbnail?: string
  prompt?: string
}

interface CardEditModalProps {
  name: string
  cardType: CardType
  worldId?: string | null
  thumbnail?: string | null
  thumbnailFile?: File | null
  onThumbnailSelect?: (file: File) => void
  prompt?: string
  attributes?: Record<string, any>
  fields: AttributeField[]
  allCards: Card[]
  onChange: (key: string, value: any) => void
  onSave: (card: Card) => void
  onClose: () => void
  onVariantSelect?: (variantName: string) => void
  readOnly?: boolean
  onCreateVariant?: (worldName: string) => void
}

export default function CardEditModal({
  name,
  cardType,
  worldId = null,
  thumbnail,
  thumbnailFile,
  onThumbnailSelect,
  prompt = "",
  attributes = {},
  fields,
  allCards,
  onChange,
  onSave,
  onClose,
  onVariantSelect,
  readOnly = false,
}: CardEditModalProps) {
  const worldCards = allCards.filter((c: Card) => c.cardType === "world" && c.name)
  const worldOptions = Array.from(new Set(worldCards.map((c) => c.name))).sort()

  const variantOptions =
    cardType === "character"
      ? allCards
          .filter(
            (c) =>
              c.cardType === "character" &&
              c.baseCharacterName === name &&
              c.world !== undefined &&
              c.name !== name
          )
          .map((c) => c.world!)
      : []

  const previewURL = thumbnailFile ? URL.createObjectURL(thumbnailFile) : thumbnail

  const handleSave = () => {
    const normalizedName = name.trim()
    const card: Card = {
      name: normalizedName,
      cardType,
      world: worldId || undefined,
      prompt: prompt || "",
      thumbnail: thumbnailFile?.name || thumbnail || undefined, // FIXED HERE
      attributes: {
        ...attributes,
        id: normalizedName.toLowerCase().replace(/\s+/g, "_")
      }
    }
    onSave(card)
  }

  return (
    <div className="fixed inset-0 z-50 backdrop-blur-sm bg-black/40 flex items-center justify-center">
      <div className="w-[600px] max-h-[95vh] overflow-y-auto bg-zinc-950 rounded-2xl border-4 border-blue-600 shadow-2xl flex flex-col">
        <div className="flex justify-between items-center px-6 py-4 border-b border-zinc-800 bg-zinc-900">
          <h2 className="text-white text-xl font-bold">✏️ {name}</h2>
          <button onClick={onClose} className="text-white/60 hover:text-white text-xl">✕</button>
        </div>

        {previewURL && (
          <img src={previewURL} alt="Thumbnail" className="w-full h-[400px] object-cover border-y border-zinc-700" />
        )}

        <div className="p-6 space-y-4">
          {!readOnly && (
            <div>
              <label className="block text-xs uppercase text-zinc-500 mb-1">Thumbnail</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) onThumbnailSelect?.(file)
                }}
                className="w-full text-sm text-white"
              />
            </div>
          )}

          <div>
            <label className="block text-xs uppercase text-zinc-500 mb-1">🌍 World Variant</label>
            <select
              value={worldId || ""}
              onChange={(e) => onChange("world", e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 text-white text-sm px-3 py-2 rounded"
              disabled={readOnly}
            >
              <option value="">— Select a world —</option>
              {worldOptions.map((name) => (
                <option key={name} value={name}>
                  🌍 {name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs uppercase text-zinc-500 mb-1">Card Prompt or Description</label>
            <textarea
              value={prompt}
              onChange={(e) => onChange("prompt", e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 text-white text-sm px-3 py-2 rounded resize-none"
              rows={3}
              disabled={readOnly}
            />
          </div>

          {fields.map((field) => {
            if (field.key === "name") return null
            return (
              <div key={field.key}>
                <label className="block text-xs uppercase text-zinc-500 mb-1">{field.label}</label>
                {field.options ? (
                  <select
                    value={attributes?.[field.key] || ""}
                    onChange={(e) => onChange(field.key, e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 text-white text-sm px-3 py-2 rounded"
                    disabled={readOnly}
                  >
                    <option value="">— Select —</option>
                    {field.options.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type === "number" ? "number" : "text"}
                    value={attributes?.[field.key] ?? ""}
                    onChange={(e) =>
                      onChange(field.key, field.type === "number" ? Number(e.target.value) : e.target.value)
                    }
                    className="w-full bg-zinc-900 border border-zinc-700 text-white text-sm px-3 py-2 rounded"
                    disabled={readOnly}
                  />
                )}
              </div>
            )
          })}

          <div>
            <label className="block text-xs uppercase text-zinc-500 mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => onChange("name", e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 text-white text-sm px-3 py-2 rounded"
              disabled={readOnly}
            />
          </div>

          {cardType === "character" && variantOptions.length > 0 && (
            <div>
              <label className="block text-xs uppercase text-zinc-500 mb-1">Load Variant for World</label>
              <select
                onChange={(e) => onVariantSelect?.(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-700 text-white text-sm px-3 py-2 rounded"
                disabled={readOnly}
              >
                <option value="">— Load variant —</option>
                {variantOptions.map((v) => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center px-6 py-4 border-t border-zinc-800 bg-zinc-900">
          <button onClick={onClose} className="bg-zinc-800 hover:bg-zinc-700 text-white text-sm px-4 py-2 rounded">
            Cancel
          </button>
          {!readOnly && (
            <button onClick={handleSave} className="bg-green-600 hover:bg-green-500 text-white text-sm px-4 py-2 rounded">
              Save
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
