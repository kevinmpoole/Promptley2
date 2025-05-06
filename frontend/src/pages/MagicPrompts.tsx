import React, { useState, useEffect } from "react"

export default function MagicPrompts() {
  const [character, setCharacter] = useState("")
  const [world, setWorld] = useState("")
  const [prop, setProp] = useState("")
  const [shot, setShot] = useState("")
  const [prompt, setPrompt] = useState("")

  const generatePrompt = async () => {
    const res = await fetch("http://localhost:8000/api/magic_prompt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ character, world, prop, shot }),
    })
    const data = await res.json()
    setPrompt(data.prompt)
  }

  return (
    <div className="max-w-5xl mx-auto space-y-10 p-10">
      <h1 className="text-3xl font-bold text-white">✨MAGIC PROMPTS</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-zinc-900 p-6 rounded-xl border border-zinc-800">
        <div>
          <label className="block text-sm text-zinc-400 mb-1">Character</label>
          <input value={character} onChange={e => setCharacter(e.target.value)} placeholder="Buckley" className="w-full px-3 py-2 rounded bg-zinc-800 text-white border border-zinc-700" />
        </div>
        <div>
          <label className="block text-sm text-zinc-400 mb-1">World</label>
          <input value={world} onChange={e => setWorld(e.target.value)} placeholder="Jurassic" className="w-full px-3 py-2 rounded bg-zinc-800 text-white border border-zinc-700" />
        </div>
        <div>
          <label className="block text-sm text-zinc-400 mb-1">Prop</label>
          <input value={prop} onChange={e => setProp(e.target.value)} placeholder="Lasso" className="w-full px-3 py-2 rounded bg-zinc-800 text-white border border-zinc-700" />
        </div>
        <div>
          <label className="block text-sm text-zinc-400 mb-1">Shotlist</label>
          <input value={shot} onChange={e => setShot(e.target.value)} placeholder="Shot23" className="w-full px-3 py-2 rounded bg-zinc-800 text-white border border-zinc-700" />
        </div>
      </div>

      <button onClick={generatePrompt} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500">🎲 Generate Prompt</button>

      <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 mt-6">
        <h2 className="text-xl font-semibold text-white mb-2">🧠 Prompt Output</h2>
        <pre className="bg-zinc-800 text-zinc-100 p-4 rounded whitespace-pre-wrap">{prompt}</pre>
      </div>
    </div>
  )
}
