import { useEffect, useState } from "react"
import { CardType } from "../types/CardTypes"

type CardData = {
  name: string
  cardType: CardType
  thumbnail?: string
}

export default function PromptBuilder() {
  const [characters, setCharacters] = useState<CardData[]>([])
  const [worlds, setWorlds] = useState<CardData[]>([])
  const [selectedCharacter, setSelectedCharacter] = useState<string>("")
  const [selectedWorld, setSelectedWorld] = useState<string>("")
  const [actionText, setActionText] = useState<string>("")
  const [copied, setCopied] = useState(false)
  const [prompt, setPrompt] = useState<string>("")
  const API_BASE = import.meta.env.VITE_API_BASE_URL

  useEffect(() => {
    const fetchCards = async () => {
      const uni = "ExampleUniverse"
  
      const fetchData = async (type: CardType): Promise<CardData[]> => {
        const res = await fetch(`${API_BASE}/api/universe/${uni}/cards/${type}`)
        if (!res.ok) return []
        return await res.json()
      }
      
  
      const [charData, worldData] = await Promise.all([
        fetchData("character"),
        fetchData("world")
      ])
  
      setCharacters(charData)
      setWorlds(worldData)
    }
  
    fetchCards()
  }, [])
  

  const fetchPrompt = async () => {
    if (!selectedCharacter || !selectedWorld) return setPrompt("")

    const res = await fetch("http://localhost:8000/api/build-prompt/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        universe: "ExampleUniverse",
        character: selectedCharacter,
        world: selectedWorld,
        scene: null,
        prop: null,
        event: null,
        shot: null,
        action: actionText || null,
      }),
    })

    if (res.ok) {
      const data = await res.json()
      setPrompt(data.prompt || "")
    } else {
      setPrompt("❌ Error building prompt")
    }
  }

  useEffect(() => {
    fetchPrompt()
  }, [selectedCharacter, selectedWorld, actionText])

  const copyPrompt = () => {
    navigator.clipboard.writeText(prompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const randomize = () => {
    const rand = (arr: CardData[]) => arr[Math.floor(Math.random() * arr.length)]?.name || ""
    setSelectedCharacter(rand(characters))
    setSelectedWorld(rand(worlds))
  }

  const reset = () => {
    setSelectedCharacter("")
    setSelectedWorld("")
    setActionText("")
  }

  return (
    <div className="max-w-4xl mx-auto p-10 space-y-6">
      <h1 className="text-3xl font-bold text-white mb-4">🎯 Prompt Builder</h1>

      <div className="bg-zinc-900 rounded-xl p-6 space-y-4 border border-zinc-700">
        {/* Character Dropdown */}
        <label className="block">
          <span className="text-sm text-zinc-400">Character</span>
          <select
            value={selectedCharacter}
            onChange={(e) => setSelectedCharacter(e.target.value)}
            className="mt-1 w-full px-3 py-2 rounded bg-zinc-800 text-white border border-zinc-700"
          >
            <option value="">Select character</option>
            {characters.map((char) => (
              <option key={char.name} value={char.name}>{char.name}</option>
            ))}
          </select>
        </label>

        {/* World Dropdown */}
        <label className="block">
          <span className="text-sm text-zinc-400">World</span>
          <select
            value={selectedWorld}
            onChange={(e) => setSelectedWorld(e.target.value)}
            className="mt-1 w-full px-3 py-2 rounded bg-zinc-800 text-white border border-zinc-700"
          >
            <option value="">Select world</option>
            {worlds.map((world) => (
              <option key={world.name} value={world.name}>{world.name}</option>
            ))}
          </select>
        </label>

        {/* Action Textarea */}
        <label className="block">
          <span className="text-sm text-zinc-400">Action</span>
          <textarea
            value={actionText}
            onChange={(e) => setActionText(e.target.value)}
            placeholder="e.g. holding a glowing lasso in front of a portal"
            className="mt-1 w-full px-3 py-2 rounded bg-zinc-800 text-white border border-zinc-700"
            rows={3}
          />
        </label>

        <div className="flex gap-4 mt-2">
          <button
            onClick={copyPrompt}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {copied ? "✅ Copied!" : "📋 Copy Prompt"}
          </button>
          <button
            onClick={randomize}
            className="px-4 py-2 bg-zinc-700 text-white rounded hover:bg-zinc-600"
          >
            🎲 Randomize
          </button>
          <button
            onClick={reset}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500"
          >
            🔄 Reset
          </button>
        </div>
      </div>

      {/* Prompt Preview */}
      <div className="bg-zinc-950 rounded-xl p-4 border border-zinc-800 text-sm text-white">
        {prompt ? (
          <span>{prompt}</span>
        ) : (
          <span className="text-zinc-500 italic">Select a character and world to generate a prompt.</span>
        )}
      </div>
    </div>
  )
}
