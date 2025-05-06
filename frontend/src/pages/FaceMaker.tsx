import { useState } from "react"

export default function FaceMaker() {
  const DEFAULT_TRAITS = {
    faceShape: 50,
    eyeSpacing: 50,
    jawWidth: 50,
    noseLength: 50,
    mouthSize: 50,
  }

  const [faceTraits, setFaceTraits] = useState({ ...DEFAULT_TRAITS })
  const [selectedCharacter, setSelectedCharacter] = useState("")

  const updateTrait = (key: keyof typeof faceTraits, value: number) => {
    setFaceTraits((prev) => ({ ...prev, [key]: value }))
  }

  // This determines which of the 001–030 preview PNGs to show
  const headshotIndex = Math.max(1, Math.min(30, Math.floor(
    (faceTraits.faceShape + faceTraits.eyeSpacing + faceTraits.jawWidth + faceTraits.noseLength + faceTraits.mouthSize) / 17
  )))

  const paddedIndex = headshotIndex.toString().padStart(3, "0")
  const previewImage = `/images/${paddedIndex}.png`

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-10">
      <h1 className="text-3xl font-bold mb-8">🧑‍🎨 Face Maker</h1>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Sliders Panel */}
        <div className="flex-1 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(faceTraits).map(([trait, value]) => (
              <div key={trait}>
                <label className="block text-sm font-semibold capitalize text-zinc-300 mb-1">
                  {trait}
                </label>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={value}
                  onChange={(e) =>
                    updateTrait(trait as keyof typeof faceTraits, parseInt(e.target.value))
                  }
                  className="w-full accent-blue-500"
                />
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <input
              className="px-3 py-2 bg-zinc-800 text-white border border-zinc-700 rounded w-full"
              placeholder="Character name (optional)"
              value={selectedCharacter}
              onChange={(e) => setSelectedCharacter(e.target.value)}
            />
            <div className="flex gap-3">
              <button
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500"
                onClick={() => setFaceTraits({ ...DEFAULT_TRAITS })}
              >
                Reset
              </button>
              <button
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-500"
                onClick={() => alert("Assigned to character (simulated).")}
              >
                Assign
              </button>
            </div>
          </div>
        </div>

        {/* Live Face Preview */}
        <div className="flex-1 max-w-sm mx-auto bg-zinc-900 p-6 rounded-xl shadow-md border border-zinc-700">
          <h2 className="text-lg font-semibold mb-4 text-white">🧪 Live Preview</h2>
          <img
            src={previewImage}
            alt={`Preview ${paddedIndex}`}
            className="w-full h-auto rounded-xl border border-zinc-800"
          />
          <p className="mt-2 text-sm text-zinc-400 text-center">Previewing: {paddedIndex}.png</p>
        </div>
      </div>
    </div>
  )
}
