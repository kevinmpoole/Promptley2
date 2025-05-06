// src/pages/UniverseLoader.tsx
import { useEffect, useState } from "react"
import { CardViewer } from "../components/CardViewer"
import { CardType } from "../types/CardTypes"
import { useUniverse } from "../lib/universeContext"
import { CardModal, CardModalData } from "../components/CardModal"

export interface CardData {
  id: string
  name: string
  cardType: CardType
  thumbnail?: string
  prompt?: string
  attributes?: Record<string, any>
  variantOf?: string
  worldId?: string
}

export default function UniverseLoader() {
  const { universe } = useUniverse()
  const cardTypes: CardType[] = ["world", "character", "prop", "scene", "shot", "event", "frame"]

  const [selectedCard, setSelectedCard] = useState<CardModalData | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [formType, setFormType] = useState<CardType>("character")
  const [formData, setFormData] = useState({ name: "", thumbnail: "" })
  const [editCardIndex, setEditCardIndex] = useState<number | null>(null)
  const [cardsByType, setCardsByType] = useState<Record<CardType, CardData[]>>(Object.fromEntries(
    cardTypes.map(type => [type, [] as CardData[]])
  ) as Record<CardType, CardData[]>)

  const fetchCardsForType = async (type: CardType) => {
    try {
      const res = await fetch(`/api/universe/${universe}/cards/${type}`)
      const data = await res.json()
      const withIds: CardData[] = data.map((card: any) => ({
        ...card,
        id: card.name.toLowerCase().replace(/\s+/g, "_"),
      }))
      setCardsByType(prev => ({ ...prev, [type]: withIds }))
    } catch (err) {
      console.error(`Failed to load ${type} cards:`, err)
    }
  }

  useEffect(() => {
    cardTypes.forEach(fetchCardsForType)
  }, [universe])

  const handleDeleteCard = async (card: CardData) => {
    try {
      await fetch(`/api/universe/${universe}/cards/${card.cardType}/${card.id}`, {
        method: "DELETE",
      })
      fetchCardsForType(card.cardType)
    } catch (err) {
      console.error("Error deleting card:", err)
    }
  }

  const handleCreateCard = async () => {
    if (!formData.name.trim()) return
    const payload = {
      name: formData.name.trim(),
      cardType: formType,
      thumbnail: formData.thumbnail.trim() || undefined,
    }

    try {
      if (editCardIndex !== null) {
        const old = cardsByType[formType][editCardIndex]
        await fetch(`/api/universe/${universe}/cards/${formType}/${old.id}`, { method: "DELETE" })
      }
      await fetch(`/api/universe/${universe}/cards/${formType}`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      fetchCardsForType(formType)
    } catch (err) {
      console.error("Error creating/updating card:", err)
    }

    setFormOpen(false)
    setFormData({ name: "", thumbnail: "" })
    setEditCardIndex(null)
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-10 space-y-16">
      <h1 className="text-4xl font-bold">UNIVERSE DASHBOARD</h1>

      {cardTypes.map(type => (
        <section key={type} className="space-y-4">
          <header className="flex items-center justify-between">
            <h2 className="text-2xl capitalize">{type} Cards</h2>
            <button
              className="px-3 py-1 bg-zinc-800 rounded hover:bg-zinc-700"
              onClick={() => { setFormOpen(true); setFormType(type); setEditCardIndex(null); setFormData({ name: '', thumbnail: '' }) }}
            >
              + New
            </button>
          </header>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {cardsByType[type].map((card, idx) => (
              <div key={card.id} className="relative">
                <CardViewer
                  {...card}
                  universe={universe}
                  thumbnail={card.thumbnail?.split('/').pop()}
                  onClick={() => setSelectedCard(card as CardModalData)}
                />
                <div className="absolute top-2 right-2 flex space-x-2">
                  <button
                    className="px-2 py-1 bg-blue-600 rounded text-xs"
                    onClick={() => {
                      setFormOpen(true)
                      setFormType(type)
                      setEditCardIndex(idx)
                      setFormData({ name: card.name, thumbnail: card.thumbnail || '' })
                    }}
                  >Edit</button>
                  <button
                    className="px-2 py-1 bg-red-600 rounded text-xs"
                    onClick={() => handleDeleteCard(card)}
                  >Delete</button>
                </div>
              </div>
            ))}
          </div>

          {formOpen && formType === type && (
            <div className="mt-6 p-6 bg-zinc-900 rounded border border-zinc-700">
              <h3 className="text-lg mb-4">{editCardIndex !== null ? 'Edit' : 'New'} {type} Card</h3>
              <input
                placeholder="Name"
                value={formData.name}
                onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full mb-4 p-2 bg-zinc-800 rounded border border-zinc-700"
              />
              <input
                placeholder="Thumbnail filename or URL"
                value={formData.thumbnail}
                onChange={e => setFormData(prev => ({ ...prev, thumbnail: e.target.value }))}
                className="w-full mb-4 p-2 bg-zinc-800 rounded border border-zinc-700"
              />
              <div className="flex justify-end space-x-3">
                <button onClick={() => { setFormOpen(false); setEditCardIndex(null) }} className="px-4 py-2">Cancel</button>
                <button onClick={handleCreateCard} className="px-4 py-2 bg-blue-600 rounded">Save</button>
              </div>
            </div>
          )}
        </section>
      ))}

      {selectedCard && (
        <CardModal card={selectedCard} onClose={() => setSelectedCard(null)} />
      )}
    </div>
  )
}
