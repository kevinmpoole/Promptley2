// src/components/MiniCard.tsx
import React from "react"
import { useDrag } from "react-dnd"
import { CardType } from "../types/CardTypes"

export interface MiniCardData {
  id: string
  name: string
  cardType: CardType
  thumbnail?: string
}

interface MiniCardProps extends MiniCardData {
  onRemove?: () => void
  onClick?: () => void
}

export const MiniCard: React.FC<MiniCardProps> = ({
  id,
  name,
  cardType,
  thumbnail,
  onRemove,
  onClick,
}) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "MINICARD",
    item: { id, name, cardType, thumbnail },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }), [id, name, cardType, thumbnail])

  const borderColors: Record<CardType, string> = {
    character: "border-blue-500",
    world: "border-green-500",
    scene: "border-purple-500",
    prop: "border-yellow-500",
    shot: "border-pink-500",
    event: "border-orange-500",
    frame: "border-white",
  }

  return (
    <div
      ref={drag}
      onClick={onClick}
      className={`w-20 h-24 bg-zinc-800 border-2 rounded-md shadow text-xs text-white flex flex-col items-center justify-center p-1 relative cursor-pointer ${
        borderColors[cardType] || "border-zinc-600"
      } ${isDragging ? "opacity-40" : "opacity-100"} transition-opacity`}
    >
      {thumbnail ? (
        <img
          src={thumbnail}
          alt={name}
          className="w-full h-12 object-cover rounded mb-1"
        />
      ) : (
        <div className="w-full h-12 bg-zinc-700 flex items-center justify-center rounded mb-1 text-zinc-400">
          {cardType}
        </div>
      )}
      <div className="text-center truncate w-full px-1">{name}</div>

      {onRemove && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onRemove()
          }}
          className="absolute top-0 right-0 text-red-400 text-xs px-1 hover:text-red-200"
        >
          ×
        </button>
      )}
    </div>
  )
}
