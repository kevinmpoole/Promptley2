import React, { useState } from "react"

const cameraOptions = [
  "wide shot",
  "medium shot",
  "close-up",
  "tracking shot",
  "overhead",
]

const timeOptions = ["day", "night", "dawn", "dusk"]

const weatherOptions = ["clear", "foggy", "stormy", "snowy", "rainy"]

const ShotBuilder = () => {
  const [description, setDescription] = useState("")
  const [world, setWorld] = useState("")
  const [camera, setCamera] = useState(cameraOptions[0])
  const [timeOfDay, setTimeOfDay] = useState(timeOptions[0])
  const [weather, setWeather] = useState(weatherOptions[0])
  const [copied, setCopied] = useState(false)

  const prompt = `Shot Description: ${description}\nWorld: ${world}\nCamera: ${camera}\nTime: ${timeOfDay}, Weather: ${weather}`

  const handleCopy = async () => {
    await navigator.clipboard.writeText(prompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="max-w-6xl mx-auto space-y-10 p-6">
      <h1 className="text-4xl font-bold text-white">🎬 Shot Builder</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left: Shot Form */}
        <div className="space-y-5 bg-zinc-900 p-6 rounded-lg shadow-lg border border-zinc-800">
          <h2 className="text-2xl font-semibold text-white mb-4">🧰 Build Your Shot</h2>

          <div>
            <label className="block text-sm text-zinc-400 mb-1">Shot Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded bg-zinc-800 text-white border border-zinc-700"
              placeholder="e.g., Buckley stares into the canyon"
            />
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-1">World</label>
            <input
              type="text"
              value={world}
              onChange={(e) => setWorld(e.target.value)}
              className="w-full px-3 py-2 rounded bg-zinc-800 text-white border border-zinc-700"
              placeholder="e.g., Jurassic, Wild West..."
            />
          </div>

          <div>
            <label className="block text-sm text-zinc-400 mb-1">Camera Type</label>
            <select
              value={camera}
              onChange={(e) => setCamera(e.target.value)}
              className="w-full px-3 py-2 rounded bg-zinc-800 text-white border border-zinc-700"
            >
              {cameraOptions.map((opt) => (
                <option key={opt}>{opt}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm text-zinc-400 mb-1">Time of Day</label>
              <select
                value={timeOfDay}
                onChange={(e) => setTimeOfDay(e.target.value)}
                className="w-full px-3 py-2 rounded bg-zinc-800 text-white border border-zinc-700"
              >
                {timeOptions.map((opt) => (
                  <option key={opt}>{opt}</option>
                ))}
              </select>
            </div>

            <div className="flex-1">
              <label className="block text-sm text-zinc-400 mb-1">Weather</label>
              <select
                value={weather}
                onChange={(e) => setWeather(e.target.value)}
                className="w-full px-3 py-2 rounded bg-zinc-800 text-white border border-zinc-700"
              >
                {weatherOptions.map((opt) => (
                  <option key={opt}>{opt}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Right: Prompt Preview */}
        <div className="bg-zinc-900 p-6 rounded-lg shadow-lg border border-zinc-800 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold text-white">🎯 Prompt Preview</h2>
            <button
              onClick={handleCopy}
              className="text-sm px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-500"
            >
              {copied ? "✅ Copied!" : "Copy Prompt"}
            </button>
          </div>

          <pre className="whitespace-pre-wrap bg-zinc-800 text-zinc-100 p-4 rounded-lg font-mono text-sm transition-all">
            {prompt}
          </pre>
        </div>
      </div>
    </div>
  )
}

export default ShotBuilder
