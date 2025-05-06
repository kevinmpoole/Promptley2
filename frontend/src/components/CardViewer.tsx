// frontend/src/components/CardViewer.tsx

import { CardType } from "../types/CardTypes"

interface CardViewerProps {
  name: string
  cardType: CardType
  universe: string
  thumbnail?: string
  attributes?: Record<string, any>
  onClick?: () => void
}

const resolveThumbnailUrl = (thumbPath: string | undefined, universe: string): string | undefined => {
  if (!thumbPath) return undefined

  // Already absolute or root-relative
  if (thumbPath.startsWith("http") || thumbPath.startsWith("/")) return thumbPath

  // If already includes full 'universes/universe/thumbnails' structure
  if (thumbPath.startsWith(`universes/${universe}/thumbnails/`)) {
    return `/${thumbPath}`
  }

  // If backend returned 'test_universe/thumbnails/filename.png'
  if (thumbPath.startsWith(`${universe}/thumbnails/`)) {
    return `/universes/${thumbPath}`
  }

  // If it's just 'thumbnails/filename.png'
  if (thumbPath.startsWith("thumbnails/")) {
    return `/universes/${universe}/${thumbPath}`
  }

  // Otherwise treat as raw filename
  return `/universes/${universe}/thumbnails/${thumbPath}`
}
// after the CardViewer component...
export { resolveThumbnailUrl }



const borderColorByType: Record<CardType, string> = {
  character: "border-blue-500",
  world: "border-green-500",
  scene: "border-purple-500",
  prop: "border-yellow-500",
  shot: "border-pink-500",
  event: "border-orange-500",
  frame: "border-white",
}

export function CardViewer({
  name,
  cardType,
  universe,
  thumbnail,
  attributes,
  onClick,
}: CardViewerProps) {
  console.log("💥 raw thumbnail prop:", thumbnail);
  const resolvedThumb = resolveThumbnailUrl(thumbnail, universe)
  console.log("🧪 [CardViewer] Resolved:", resolvedThumb, "| Raw:", thumbnail)

  return (
    <div
      onClick={onClick}
      className={`bg-zinc-900 rounded-xl shadow-xl ring-1 ring-zinc-700 hover:ring-blue-500 
        transition-all cursor-pointer overflow-hidden group border ${borderColorByType[cardType]}`}
    >
      <div className="aspect-square bg-zinc-800 relative overflow-hidden border-b border-zinc-700">
        {resolvedThumb ? (
          <img
            src={resolvedThumb}
            alt={name}
            className="w-full h-[300px] object-cover rounded"
          />
        ) : (
          <div className="w-full h-[300px] bg-zinc-800 flex items-center justify-center text-zinc-500 text-sm italic">
            No image
          </div>
        )}
      </div>

      <div className="p-4 space-y-1">
        <h3 className="text-white text-base font-semibold truncate">{name}</h3>
        <p className="text-zinc-400 text-xs capitalize">{cardType} Card</p>

        {attributes && (
          <ul className="text-sm mt-2 space-y-1">
            {Object.entries(attributes).map(([key, value]) => {
              if (key === "prompt") return null
              const displayValue =
                typeof value === "object"
                  ? Object.entries(value)
                      .map(([k, v]) => `${k}: ${v}`)
                      .join(", ")
                  : String(value)
              return (
                <li key={key} className="text-zinc-300 text-xs">
                  <span className="font-medium text-zinc-400">{key}:</span>{" "}
                  {displayValue}
                </li>
              )
            })}
          </ul>
        )}

        {attributes?.prompt && (
          <div className="mt-2 text-xs text-zinc-400 italic truncate">
            “{attributes.prompt}”
          </div>
        )}
      </div>
    </div>
  )
}
