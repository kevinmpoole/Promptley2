// src/pages/CardBrowser.tsx
import { useState, useEffect } from "react"
import { CardViewer } from "components/CardViewer"
import { CardType } from "../types/CardTypes"
import { useUniverse } from "../lib/universeContext"
import { getSchemaForCardType } from "lib/schemaLoader"
import CardDesigner from "./CardDesigner"
import CardEditModal from "components/CardEditModal"


interface AttributeField {
  key: string
  label: string
  type: string
  required?: boolean
  options?: string[]
  children?: AttributeField[]
}

interface Card {
  name: string
  cardType: CardType
  world?: string
  baseCharacterName?: string
  isBase?: boolean
  attributes?: Record<string, any>
  thumbnail?: string
  prompt?: string
  variantOf?: string
}

const CARD_TYPES: CardType[] = ["character", "world", "scene", "prop", "shot", "event", "frame"]
type ExtendedCardType = CardType | "all"

export default function CardBrowser() {
  const { universe } = useUniverse()
  const [cards, setCards] = useState<Card[]>([])
  const [selectedType, setSelectedType] = useState<ExtendedCardType>("all")
  const [selectedCard, setSelectedCard] = useState<Card | null>(null)
  const [search, setSearch] = useState("")
  const [sortKey, setSortKey] = useState<keyof Card | "">("")
  const [showForm, setShowForm] = useState(false)
  const [showAllSchemaModal, setShowAllSchemaModal] = useState(false)
  const [newName, setNewName] = useState("")
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null)
  const [newAttributes, setNewAttributes] = useState<Record<string, any>>({})
  const [editIndex, setEditIndex] = useState<number | null>(null)
  const [schemaFields, setSchemaFields] = useState<AttributeField[]>([])

  const handleVariantSelect = (variantName: string) => {
    const variant = cards.find((c) => c.world === variantName && c.baseCharacterName === newName)
    if (variant) {
      setNewAttributes(variant.attributes || {})
      setThumbnailPreview(variant.thumbnail || null)
      setThumbnailFile(null)
    }
  }
  type CardCreate = {
    name: string
    cardType: CardType
    thumbnail?: string
    prompt?: string 
    attributes: Record<string, any>
  }
  const handleSave = async () => {
    if (selectedType === "all") return alert("Please select a card type to create.")
    if (!newName.trim()) {
      alert("⚠️ Please enter a name for the card.")
      return
    }
  
    let thumbnailPath = undefined
    if (thumbnailFile) {
      const formData = new FormData()
      formData.append("file", thumbnailFile)
    
      // Overwrite filename to match card name
      const normalizedName = newName.trim().toLowerCase().replace(/\s+/g, "_")
      const extension = thumbnailFile.name.split(".").pop() || "png"
      const newFilename = `${normalizedName}.${extension}`
    
      const renamedFile = new File([thumbnailFile], newFilename, {
        type: thumbnailFile.type,
      })
      formData.set("file", renamedFile)
    
      const thumbRes = await fetch(
        `http://localhost:8000/api/universe/${universe}/upload-thumbnail/`,
        {
          method: "POST",
          body: formData,
        }
      )
    
      if (thumbRes.ok) {
        const result = await thumbRes.json()
        thumbnailPath = result.filename // Now you store the renamed file
      } else {
        console.error("❌ Thumbnail upload failed")
      }
    }
    
  
    // Clone attributes but exclude name if accidentally present in schema
    const safeAttributes = { ...newAttributes }
    delete safeAttributes.name
  
    const newCard: CardCreate = {
      name: newName.trim(),
      cardType: selectedType,
      thumbnail: thumbnailPath || undefined,
      prompt: newAttributes.prompt || undefined,
      attributes: safeAttributes,
    }
  
    // ✅ FIXED: Add `/cards/` in the API path
    const res = await fetch(`http://localhost:8000/api/universe/${universe}/cards/${selectedType}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCard),
    })
  
    if (res.ok) {
      const updated = [...cards]
      if (editIndex !== null) updated[editIndex] = newCard
      else updated.push(newCard)
      setCards(updated)
      setShowForm(false)
    } else {
      alert("❌ Failed to save card")
    }
  }
  

  const handleThumbnailSelect = (file: File | null) => {
    setThumbnailFile(file)
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => setThumbnailPreview(reader.result as string)
      reader.readAsDataURL(file)
    } else {
      setThumbnailPreview(null)
    }
  }

  const createVariant = (original: Card, newWorld: string) => {
    const variantName = `${original.baseCharacterName || original.name} (${newWorld})`

    const newVariant: Card = {
      ...structuredClone(original),
      name: variantName,
      cardType: original.cardType,
      world: newWorld,
      baseCharacterName: original.baseCharacterName || original.name,
      isBase: false,
      attributes: {
        ...structuredClone(original.attributes),
        world: newWorld,
        baseCharacterName: original.baseCharacterName || original.name,
      },
    }

    setNewName(variantName)
    setNewAttributes(newVariant.attributes || {})
    setThumbnailPreview(newVariant.thumbnail || null)
    setSelectedType(original.cardType)
    setEditIndex(null)
    setShowForm(true)
  }

  useEffect(() => {
    const fetchCards = async () => {
      if (!universe) return
      const typesToFetch = selectedType === "all" ? CARD_TYPES : [selectedType]
      const allFetched: Card[] = []

      for (const type of typesToFetch) {
        try {
          const res = await fetch(`http://localhost:8000/api/universe/${universe}/cards/${type}`)
          if (!res.ok) continue
          const data = await res.json()
          if (!Array.isArray(data)) continue
          const typedCards = data.map((card: any) => ({ ...card, cardType: type as CardType }))
          allFetched.push(...typedCards)
        } catch (err) {
          console.warn(`Error loading cards of type ${type}:`, err)
        }
      }

      setCards(allFetched)
    }

    fetchCards()
  }, [universe, selectedType])

  useEffect(() => {
    const schemaSafeTypes: CardType[] = ["character", "world", "scene", "prop", "event", "frame"]
    if (universe && selectedType !== "all" && schemaSafeTypes.includes(selectedType)) {
      getSchemaForCardType(selectedType, universe).then(setSchemaFields)
    } else {
      setSchemaFields([])
    }
  }, [selectedType, universe])

  useEffect(() => {
    if (!showForm) {
      setNewName("")
      setThumbnailFile(null)
      setThumbnailPreview(null)
      setNewAttributes({})
      setEditIndex(null)
    }
  }, [showForm])

  const filteredCards = cards
    .filter((c) => selectedType === "all" || c.cardType === selectedType)
    .filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (!sortKey) return 0
      return String(a[sortKey] ?? "").localeCompare(String(b[sortKey] ?? ""))
    })

    // up near the top of your render, or even above it:
    const getThumbFilename = (raw?: string) =>
      raw ? raw.split("/").pop() : undefined;


    const handleDeleteCard = async (cardType: string, name: string) => {
      const safeName = name.trim().replace(/\s+/g, "_").toLowerCase()
      const res = await fetch(
        `http://localhost:8000/api/universe/${universe}/cards/${cardType}/${safeName}`,
        { method: "DELETE" }
      )
    
      if (res.ok) {
        const updated = await fetch(`http://localhost:8000/api/universe/${universe}/cards/${cardType}`)
        if (updated.ok) {
          const data = await updated.json()
          const typedCards = data.map((c: any) => ({ ...c, cardType }))
          setCards((prev) => [
            ...prev.filter((c) => c.cardType !== cardType),
            ...typedCards,
          ])
        }
      } else {
        alert("❌ Failed to delete card from server")
      }
    }
    

  return (
    <div className="p-8 text-white bg-zinc-950 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">📇 Card Browser</h1>
      <p className="text-zinc-400 mb-4 text-sm">Universe: {universe}</p>

      <div className="flex flex-wrap gap-2 mb-4">
        {["all", ...CARD_TYPES].map((type) => (
          <button
            key={type}
            onClick={() => setSelectedType(type as ExtendedCardType)}
            className={`px-3 py-1 rounded ${selectedType === type ? "bg-white text-black font-bold" : "bg-zinc-800"}`}
          >
            {type.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="flex gap-4 mb-6 items-center">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-2 bg-zinc-900 border border-zinc-700 rounded"
        />
        <select
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value as keyof Card)}
          className="px-3 py-2 w-[160px] bg-zinc-900 border border-zinc-700 rounded"
        >
          <option value="">Sort by...</option>
          <option value="name">Name</option>
          <option value="cardType">Type</option>
        </select>
        {selectedType === "all" ? (
          <button
            onClick={() => setShowAllSchemaModal(true)}
            className="ml-auto px-4 py-2 bg-purple-600 text-white rounded"
          >
            ✏️ Edit Schema
          </button>
        ) : (
          <button
            onClick={() => setShowForm(true)}
            className="ml-auto px-4 py-2 bg-blue-600 text-white rounded"
          >
            + New {selectedType}
          </button>
        )}
      </div>

      {showForm && selectedType !== "all" && (
        <CardEditModal
          name={newName}
          cardType={selectedType as CardType}
          worldId={newAttributes.world || null}
          thumbnail={thumbnailPreview}
          thumbnailFile={thumbnailFile}
          prompt={newAttributes.prompt || ""}
          attributes={newAttributes}
          fields={schemaFields}
          onChange={(key, value) => {
            if (key === "name") {
              setNewName(value)
            } else {
              setNewAttributes((prev) => ({ ...prev, [key]: value }))
            }
          }}
          onClose={() => setShowForm(false)}
          onSave={handleSave}
          allCards={cards}
          onVariantSelect={handleVariantSelect}
          onThumbnailSelect={handleThumbnailSelect}
          readOnly={false}
        />
      )}

      {showAllSchemaModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center">
          <div className="bg-zinc-900 rounded-xl p-6 w-[90%] max-w-5xl border border-zinc-700 overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">✏️ Edit All Schemas</h2>
              <button
                onClick={() => setShowAllSchemaModal(false)}
                className="text-zinc-400 hover:text-white text-xl"
              >
                ✕
              </button>
            </div>
            <CardDesigner />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCards.length === 0 ? (
          <div className="text-zinc-500 text-center mt-8 italic col-span-full">
            No cards found for this filter.
          </div>
        ) : (
          filteredCards.map((card, idx) => (
            <div
              key={idx}
              className="relative group transition-transform hover:scale-[1.01]"
            >
              <CardViewer
                {...card}
                universe={universe}
                thumbnail={getThumbFilename(card.thumbnail)}
              />
          
              <div className="absolute top-2 right-2 flex-col gap-2 hidden group-hover:flex">
                <button
                  className="text-xs bg-blue-600 text-white px-2 py-1 rounded"
                  onClick={() => {
                    setShowForm(true)
                    setEditIndex(idx)
                    setNewName(card.name)
                    setSelectedType(card.cardType)
                    setNewAttributes(card.attributes || {})
                    setThumbnailPreview(card.thumbnail || null)
                    setThumbnailFile(null)
                  }}
                >
                  Edit
                </button>
  <button
    className="text-xs bg-red-600 text-white px-2 py-1 rounded"
    onClick={() => {
      if (confirm("Delete this card?")) {
        handleDeleteCard(card.cardType, card.name)
      }
    }}
  >
    Delete
  </button>
  <button
    className="text-xs bg-purple-600 text-white px-2 py-1 rounded"
    onClick={() => {
      const newWorld = prompt("Enter new world ID for variant:")
      if (newWorld) createVariant(card, newWorld)
    }}
  >
    Variant
  </button>
  {card.variantOf && (
    <p className="text-[10px] text-purple-400 italic mt-1">
      ↳ Variant of {card.variantOf}
    </p>
  )}
</div>
            </div>
          ))
        )}
      </div>

      {selectedCard && (
        <CardEditModal
          name={selectedCard.name}
          cardType={selectedCard.cardType}
          worldId={selectedCard.attributes?.world || null}
          thumbnail={selectedCard.thumbnail}
          prompt={selectedCard.prompt}
          attributes={selectedCard.attributes}
          fields={schemaFields}
          onChange={() => {}}
          onClose={() => setSelectedCard(null)}
          onSave={() => {}}
          allCards={cards}
          onVariantSelect={() => {}}
          readOnly={true}
        />
      )}
    </div>
  )
}
