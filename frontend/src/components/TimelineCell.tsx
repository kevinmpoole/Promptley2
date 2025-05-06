// src/components/TimelineCell.tsx
import React from "react"
import { useDrop } from "react-dnd"
import { MiniCard } from "./MiniCard"
import { CardType } from "../types/CardTypes"

export interface MiniCardData {
  id: string
  name: string
  cardType: CardType
  thumbnail?: string
}

interface TimelineCellProps {
  columnId: string
  cards: MiniCardData[]
  cardType: CardType
  onDrop: (columnId: string, card: MiniCardData) => void
  onRemove: (columnId: string, cardId: string, type: CardType) => void
}

const borderColors: Record<CardType, string> = {
  character: "border-blue-500",
  world: "border-green-500",
  scene: "border-purple-500",
  prop: "border-yellow-500",
  shot: "border-pink-500",
  event: "border-orange-500",
  frame: "border-white",
}

export const TimelineCell: React.FC<TimelineCellProps> = ({
  columnId,
  cards,
  cardType,
  onDrop,
  onRemove,
}) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "MINICARD",
    drop: (item: MiniCardData) => {
      if (item.cardType === cardType) {
        onDrop(columnId, item)
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }), [columnId, cardType, onDrop])

  return (
    <div
      ref={drop}
      className={`w-32 h-32 border-2 rounded-lg flex flex-wrap justify-center items-center relative bg-zinc-900 ${
        borderColors[cardType]
      } border-dashed transition-colors ${isOver ? "bg-zinc-800" : ""}`}
    >
      {cards.length > 0 ? (
        cards.map((card) => (
          <MiniCard
            key={card.id}
            {...card}
            onRemove={() => onRemove(columnId, card.id, card.cardType)}
          />
        ))
      ) : (
        <div className="text-zinc-500 italic text-xs text-center pt-4">
          + {cardType} slot
        </div>
      )}
    </div>
  )
}
