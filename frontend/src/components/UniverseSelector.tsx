import { useEffect, useState } from "react"
import { useUniverse } from "lib/universeContext"

export const UniverseSelector = () => {
  const { universe, setUniverse } = useUniverse()
  const [options, setOptions] = useState<string[]>([])
  const [newUniverseName, setNewUniverseName] = useState("")

  const fetchUniverses = () => {
    fetch("http://localhost:8000/api/universes")
      .then(res => res.json())
      .then(data => setOptions(data.universes))
      .catch(err => console.error("Failed to load universes", err))
  }

  useEffect(() => {
    fetchUniverses()
  }, [])

  const handleCreateUniverse = async () => {
    const trimmed = newUniverseName.trim()
    if (!trimmed) return

    const res = await fetch("http://localhost:8000/api/universe/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: trimmed }),
    })

    const data = await res.json()
    if (res.ok) {
      setNewUniverseName("")
      setUniverse(data.universe)
      fetchUniverses()
    } else {
      alert(`❌ ${data.detail}`)
    }
  }

  return (
    <div className="text-sm text-white flex flex-col gap-2">
      <label className="text-gray-400">Universe:</label>
      <select
        value={universe ?? ""}
        onChange={(e) => setUniverse(e.target.value)}
        className="bg-zinc-900 border border-zinc-700 px-2 py-1 rounded text-white text-sm"
      >
        {options.map((u) => (
          <option key={u} value={u}>
            {u}
          </option>
        ))}
      </select>

      <div className="flex gap-1 mt-2">
        <input
          type="text"
          placeholder="New universe..."
          value={newUniverseName}
          onChange={(e) => setNewUniverseName(e.target.value)}
          className="flex-1 px-2 py-1 rounded bg-zinc-800 border border-zinc-700 text-white text-sm"
        />
        <button
          onClick={handleCreateUniverse}
          className="bg-blue-600 hover:bg-blue-500 px-2 py-1 rounded text-white text-sm"
        >
          + New
        </button>
      </div>
    </div>
  )
}
