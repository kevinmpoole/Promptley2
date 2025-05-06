// src/components/TimelineChannel.tsx
import React, { useState } from "react"
import { MiniCard } from "./MiniCard"
import { TimelineCell } from "./TimelineCell"
import { CardType } from "../types/CardTypes"

export interface MiniCardData {
  id: string
  name: string
  cardType: CardType
  thumbnail?: string
}

export interface TimelineChannelColumn {
  id: string
  cards: MiniCardData[]
}

export interface TimelineChannelProps {
  cardType: CardType
  columns: TimelineChannelColumn[]
  availableCards: MiniCardData[]
  onDrop: (columnId: string, card: MiniCardData) => void
  onRemove: (columnId: string, cardId: string, type: CardType) => void
}

export const TimelineChannel: React.FC<TimelineChannelProps> = ({
  cardType,
  columns,
  availableCards,
  onDrop,
  onRemove,
}) => {
  const [index, setIndex] = useState(0)

  const visibleCard = availableCards[index] || null
  const hasMultiple = availableCards.length > 1

  const goNext = () => {
    setIndex((prev) => (prev + 1) % availableCards.length)
  }

  const goPrev = () => {
    setIndex((prev) => (prev - 1 + availableCards.length) % availableCards.length)
  }

  return (
    <div className="flex items-start mb-4">
      {/* Left Slideshow Deck */}
      <div className="w-40 pr-4 flex flex-col items-end pt-1">
        <div className="text-sm text-zinc-400 font-semibold capitalize mb-2">
          {cardType}
        </div>
        {visibleCard && (
          <div className="relative">
            <MiniCard {...visibleCard} />
            {hasMultiple && (
              <div className="absolute -top-2 -right-2 flex gap-1">
                <button
                  className="text-xs px-2 py-1 bg-zinc-800 text-white border border-zinc-600 rounded hover:bg-zinc-700"
                  onClick={goPrev}
                >
                  ◀
                </button>
                <button
                  className="text-xs px-2 py-1 bg-zinc-800 text-white border border-zinc-600 rounded hover:bg-zinc-700"
                  onClick={goNext}
                >
                  ▶
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Timeline cells */}
      <div className="flex gap-6">
        {columns.map((column) => (
          <TimelineCell
            key={column.id}
            columnId={column.id}
            cards={column.cards}
            cardType={cardType}
            onDrop={onDrop}
            onRemove={onRemove}
          />
        ))}
      </div>
    </div>
  )
}
