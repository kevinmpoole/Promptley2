

import React, { useEffect, useState } from "react"
import { MiniCard } from "./MiniCard"
import { CardType } from "../types/CardTypes"
import { useUniverse } from "../lib/universeContext"
import { MiniCardData } from "../types/MiniCardData"
interface MiniCardDeckProps {
  cardType: CardType
}

export const MiniCardDeck: React.FC<MiniCardDeckProps> = ({ cardType }) => {
  const { universe } = useUniverse()
  const [cards, setCards] = useState<MiniCardData[]>([])

  useEffect(() => {
    const fetchCards = async () => {
      const res = await fetch(`http://localhost:8000/api/universe/${universe}/cards/${cardType}`)
      const data = await res.json()
      const transformed = data.map((card: any) => ({
        id: `${cardType}_${card.name.toLowerCase().replace(/\s+/g, "_")}`,
        name: card.name,
        cardType: card.cardType,
        thumbnail: card.thumbnail,
      }))
      setCards(transformed)
    }
    if (universe) fetchCards()
  }, [universe, cardType])

  return (
    <div>
      <h3 className="text-sm font-semibold text-zinc-400 mb-2 capitalize">{cardType}</h3>
      <div className="flex gap-2 flex-wrap">
        {cards.map((card) => (
          <MiniCard key={card.id} {...card} />
        ))}
      </div>
    </div>
  )
}
