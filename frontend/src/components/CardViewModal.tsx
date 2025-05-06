
import { CardType } from "../types/CardTypes"

interface CardViewModalProps {
  name: string
  cardType: CardType
  worldId?: string | null
  thumbnail?: string | null
  prompt?: string
  attributes?: Record<string, any>
  variantOf?: string
  onClose: () => void
}

const borderColorForType = (type: CardType) => {
  switch (type) {
    case "character": return "border-blue-500"
    case "prop": return "border-green-500"
    case "scene": return "border-yellow-500"
    case "world": return "border-purple-500"
    case "shot": return "border-pink-500"
    case "event": return "border-orange-500"
    case "frame": return "border-red-500"
    default: return "border-zinc-500"
  }
}

export default function CardViewModal({
  name,
  cardType,
  worldId,
  thumbnail,
  prompt,
  attributes = {},
  variantOf,
  onClose,
}: CardViewModalProps) {
  return (
    <div className="fixed inset-0 z-50 backdrop-blur-sm bg-black/30 flex items-center justify-center p-4">
      <div className={`w-[600px] max-h-[92vh] rounded-2xl border-[5px] shadow-2xl overflow-hidden flex flex-col ${borderColorForType(cardType)} bg-gradient-to-br from-zinc-900 to-black`}>
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-zinc-900 border-b border-zinc-800">
          <h2 className="text-2xl font-bold text-white tracking-wide">
            📖 {name}
          </h2>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white bg-zinc-800 border border-zinc-700 rounded-full w-8 h-8 flex items-center justify-center"
          >
            ✕
          </button>
        </div>

        {/* Thumbnail */}
        {thumbnail && (
          <div className="relative border-b-4 border-zinc-700">
            <img
              src={thumbnail}
              alt={`${name} thumbnail`}
              className="w-full h-[360px] object-cover border-t border-b border-yellow-500"
            />
            {variantOf && (
              <div className="absolute top-2 left-2 text-xs bg-purple-700 text-white px-2 py-1 rounded shadow">
                Variant of {variantOf}
              </div>
            )}
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-zinc-950">
          {/* Variant dropdown */}
          {variantOf && (
            <div>
              <label className="text-xs text-zinc-500 uppercase block mb-1">World Variant</label>
              <div className="bg-zinc-900 border border-zinc-700 text-white text-sm px-3 py-2 rounded">
                {worldId || "—"}
              </div>
            </div>
          )}

          {/* Prompt */}
          {prompt && (
            <div>
              <label className="text-xs text-zinc-500 uppercase block mb-1">Card Prompt or Description</label>
              <div className="bg-zinc-900 text-zinc-300 text-sm p-3 rounded border border-zinc-700 whitespace-pre-wrap leading-snug">
                {prompt}
              </div>
            </div>
          )}

          {/* Attribute Grid */}
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(attributes).map(([key, value]) => (
              <div key={key}>
                <label className="block text-[10px] uppercase text-zinc-500 tracking-wide mb-1">
                  {key}
                </label>
                <div className="bg-zinc-900 px-3 py-2 rounded text-white text-sm border border-zinc-700">
                  {String(value)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
