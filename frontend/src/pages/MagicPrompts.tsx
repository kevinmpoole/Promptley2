import React, { useState, useEffect } from "react";
import { CardViewer } from "../components/CardViewer";
import { CardType } from "../types/CardTypes";
import { useUniverse } from "../lib/universeContext";

export default function MagicPrompts() {
  const { universe } = useUniverse();
  const cardTypes: CardType[] = [
    "character",
    "world",
    "scene",
    "prop",
    "shot",
    "event",
    "frame",
  ];

  const [cardType, setCardType] = useState<CardType>("character");
  const [overridePrompt, setOverridePrompt] = useState<string>("");
  const [generatedCard, setGeneratedCard] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateCard = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/universe/${universe}/cards/${cardType}/magic`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: "",
            cardType: cardType,
            attributes: {},
            overridePrompt: overridePrompt,
          }),
        }
      );
      if (!res.ok) throw new Error("Magic generation failed");
      const card = await res.json();
      setGeneratedCard(card);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const saveCard = async () => {
    if (!generatedCard) return;
    try {
      const res = await fetch(
        `/api/universe/${universe}/cards/${cardType}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(generatedCard),
        }
      );
      if (!res.ok) throw new Error("Save failed");
      alert("Card saved to deck!");
      // Optionally clear or keep preview
    } catch (e: any) {
      alert(`Error saving card: ${e.message}`);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 p-8">
      <h1 className="text-3xl font-bold text-white">✨ Magic Card Generator</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-zinc-900 p-6 rounded-xl border border-zinc-800">
        <div className="col-span-1">
          <label className="block text-sm text-zinc-400 mb-1">
            Card Type
          </label>
          <select
            value={cardType}
            onChange={(e) => setCardType(e.target.value as CardType)}
            className="w-full px-3 py-2 rounded bg-zinc-800 text-white border border-zinc-700"
          >
            {cardTypes.map((ct) => (
              <option key={ct} value={ct}>
                {ct.charAt(0).toUpperCase() + ct.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm text-zinc-400 mb-1">
            Prompt Override (optional)
          </label>
          <textarea
            rows={3}
            value={overridePrompt}
            onChange={(e) => setOverridePrompt(e.target.value)}
            placeholder="e.g. A stoic gunslinger with a secret past..."
            className="w-full px-3 py-2 rounded bg-zinc-800 text-white border border-zinc-700"
          />
        </div>
      </div>

      <button
        onClick={generateCard}
        disabled={loading}
        className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-500 disabled:opacity-50"
      >
        {loading ? "Generating…" : "🪄 Generate Card"}
      </button>

      {error && (
        <div className="text-red-500 mt-2">Error: {error}</div>
      )}

      {generatedCard && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-white mb-4">
            🔍 Preview Card
          </h2>
          <CardViewer
            name={generatedCard.name}
            cardType={cardType}
            universe={universe}
            thumbnail={generatedCard.thumbnail}
            attributes={generatedCard.attributes}
            prompt={generatedCard.prompt}
            onEdit={() => {} }
            onDelete={() => {} }
            onVariant={() => {} }
          />

          <div className="mt-4">
            <button
              onClick={saveCard}
              className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-500"
            >
              💾 Save Card to Deck
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
