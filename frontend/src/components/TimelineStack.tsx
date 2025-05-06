// src/components/TimelineStack.tsx

import React from "react"
import { CardType } from "../types/CardTypes"
import { MiniCard } from "./MiniCard"
import { MiniCardData } from "../types/MiniCardData"
export interface TimelineColumn {
  id: string
  world: MiniCardData | null
  scene: MiniCardData | null
  shot: MiniCardData | null
  characters: MiniCardData[]
  props: MiniCardData[]
}

export interface TimelineStackProps {
  column: TimelineColumn
  onDropCard: (columnId: string, card: MiniCardData) => void
  onRemoveCard: (columnId: string, cardId: string, type: CardType) => void
}

export const TimelineStack: React.FC<TimelineStackProps> = ({
  column,
  onRemoveCard
}) => {
  // Your component logic here...
  return (
    <div className="bg-zinc-900 rounded-lg p-3 w-48 space-y-2 border border-zinc-800">
      <div className="text-xs text-zinc-400 mb-1">Shot Stack</div>

      {["world", "scene", "shot"].map((slot) => {
        const data = column[slot as keyof TimelineColumn] as MiniCardData | null
        return (
          <div key={slot}>
            <div className="text-xs capitalize text-zinc-500 mb-1">{slot}</div>
            {data ? (
              <MiniCard
                {...data}
                onRemove={() => onRemoveCard(column.id, data.id, data.cardType)}
              />
            ) : (
              <div className="h-[60px] bg-zinc-800 rounded flex items-center justify-center text-xs text-zinc-600 italic">
                + {slot}
              </div>
            )}
          </div>
        )
      })}

      {/* Characters */}
      <div>
        <div className="text-xs capitalize text-zinc-500 mb-1">Characters</div>
        {column.characters.map((char) => (
          <MiniCard
            key={char.id}
            {...char}
            onRemove={() => onRemoveCard(column.id, char.id, char.cardType)}
          />
        ))}
      </div>

      {/* Props */}
      <div>
        <div className="text-xs capitalize text-zinc-500 mb-1">Props</div>
        {column.props.map((prop) => (
          <MiniCard
            key={prop.id}
            {...prop}
            onRemove={() => onRemoveCard(column.id, prop.id, prop.cardType)}
          />
        ))}
      </div>
    </div>
  )
}
