// src/pages/PromptPage.tsx
import React, { useState } from 'react';

export default function PromptPage() {
  const BACKEND = import.meta.env.VITE_BACKEND_URL || 'https://krh66gwxxg11qz-3000.proxy.runpod.net';

  const [prompt, setPrompt] = useState('');
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt.');
      return;
    }
    setError(null);
    setLoading(true);
    setImageSrc(null);

    try {
      const res = await fetch(`${BACKEND}/prompt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt,
          negative_prompt: "",
          width: 512,
          height: 512,
          steps: 30,
          cfg_scale: 7.0
        })
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || res.statusText);
      }
      const json = await res.json();
      const b64 = json.images?.[0];
      if (!b64) throw new Error('No image returned');
      setImageSrc(`data:image/png;base64,${b64}`);
    } catch (e: any) {
      console.error(e);
      setError(e.message || 'Generation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">ComfyUI Prompt Builder</h1>

      <div className="flex gap-2">
        <input
          type="text"
          className="flex-1 p-2 bg-zinc-800 border border-zinc-700 rounded"
          placeholder="Enter your prompt..."
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
        />
        <button
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
          onClick={handleGenerate}
          disabled={loading}
        >
          {loading ? 'Generating...' : 'Generate'}
        </button>
      </div>

      {error && <div className="text-red-500">{error}</div>}

      {imageSrc && (
        <div>
          <h2 className="text-xl font-medium">Result</h2>
          <img
            src={imageSrc}
            alt="Generated"
            className="mt-2 rounded border border-zinc-700"
          />
        </div>
      )}
    </div>
  );
}
