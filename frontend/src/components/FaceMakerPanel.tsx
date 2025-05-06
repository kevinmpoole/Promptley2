// src/components/FaceMakerPanel.tsx


const faceOptions = {
  structure: ["narrow", "round", "square", "heart-shaped"],
  jawline: ["soft", "angular", "pointed", "undefined"],
  jawProminence: ["strong", "subtle", "average"],
  cheekStructure: ["high", "flat", "hollow", "chubby"],
  eyes: ["almond", "round", "hooded", "monolid", "wide-set", "close-set"],
  eyeSlant: ["upturned", "downturned", "neutral"],
  eyeColor: ["blue", "green", "hazel", "brown", "gray"],
  brows: ["arched", "flat", "bushy", "thin"],
  nose: ["button", "straight", "aquiline", "wide", "hooked"],
  noseTip: ["upturned", "rounded", "pointed", "flat"],
  lips: ["thin", "full", "bow-shaped", "wide"],
  lipCurve: ["neutral", "upturned", "downturned"]
}

export default function FaceMakerPanel() {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Facial Attributes</h3>

      {Object.entries(faceOptions).map(([category, options]) => (
        <div key={category}>
          <label className="block text-sm font-medium capitalize mb-1">{category}</label>
          <select
            name={category}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            defaultValue=""
          >
            <option value="" disabled>
              Select {category}
            </option>
            {options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  )
}
