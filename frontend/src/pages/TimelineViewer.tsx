import React, { useEffect, useState } from "react"
import { useUniverse } from "lib/universeContext"
import { CardType } from "../types/CardTypes";


interface TimelineCard {
  name: string
  cardType: CardType
  thumbnail?: string
  attributes?: Record<string, string>
}

export default function TimelineViewer() {
  const { universe } = useUniverse()
  const [cards, setCards] = useState<TimelineCard[]>([])

  useEffect(() => {
    const fetchTimelineCards = async () => {
      if (!universe) return
      const types: CardType[] = ["scene", "shot", "event"]
      let results: TimelineCard[] = []

      for (const type of types) {
        const res = await fetch(`http://localhost:8000/api/universe/${universe}/cards/${type}`)
        const data = res.ok ? await res.json() : []
        results = [...results, ...data.map((c: any) => ({ ...c, cardType: type }))]
      }

      // Optional: sort alphabetically or by name/scene index/etc
      results.sort((a, b) => a.name.localeCompare(b.name))
      setCards(results)
    }

    fetchTimelineCards()
  }, [universe])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">🕰️ Timeline Viewer</h1>

      <div className="overflow-x-auto whitespace-nowrap py-4 px-2 border border-zinc-800 rounded-lg bg-zinc-900">
        {cards.map((card, idx) => (
          <div
            key={idx}
            className="inline-block w-48 p-2 m-2 bg-white rounded-lg shadow text-center"
          >
            {card.thumbnail ? (
              <img
                src={card.thumbnail}
                alt={card.name}
                className="w-full h-24 object-cover rounded mb-2"
              />
            ) : (
              <div className="w-full h-24 bg-gray-200 flex items-center justify-center text-xs text-gray-500 rounded mb-2">
                No Image
              </div>
            )}
            <div className="text-sm font-medium">{card.name}</div>
            <div className="text-xs text-gray-500 capitalize">{card.cardType}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
