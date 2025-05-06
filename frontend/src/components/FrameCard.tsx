import React from "react"
import { MiniCardData } from "./MiniCard"

interface FrameCardProps {
  card: MiniCardData
  world?: string
  scene?: string
  characters?: string[]
  props?: string[]
  shot?: string
  prompt?: string
  onClose?: () => void
}

export const FrameCard: React.FC<FrameCardProps> = ({
  card,
  world,
  scene,
  characters = [],
  props = [],
  shot,
  prompt,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-6 max-w-md w-full relative">
        {onClose && (
          <button
            className="absolute top-2 right-3 text-zinc-500 hover:text-zinc-200 text-lg"
            onClick={onClose}
          >
            ✕
          </button>
        )}

        <div className="mb-4 text-center">
          <img
            src={card.thumbnail || "/images/placeholder-frame.png"}
            alt={card.name}
            className="w-full h-48 object-cover rounded"
          />
          <h2 className="mt-2 text-lg font-semibold">{card.name}</h2>
        </div>

        <div className="space-y-2 text-sm">
          <div><span className="text-zinc-400">World:</span> {world || "None"}</div>
          <div><span className="text-zinc-400">Scene:</span> {scene || "None"}</div>
          <div><span className="text-zinc-400">Characters:</span> {characters.length ? characters.join(", ") : "None"}</div>
          <div><span className="text-zinc-400">Props:</span> {props.length ? props.join(", ") : "None"}</div>
          <div><span className="text-zinc-400">Shot:</span> {shot || "None"}</div>
        </div>

        {prompt && (
          <div className="mt-4 text-sm">
            <div className="text-zinc-400 mb-1">Prompt:</div>
            <pre className="bg-zinc-800 text-zinc-100 p-2 rounded max-h-40 overflow-y-auto whitespace-pre-wrap text-xs">
              {prompt}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}
