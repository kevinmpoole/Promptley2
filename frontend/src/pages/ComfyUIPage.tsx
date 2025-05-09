// pages/comfy-ui.tsx
import { useState } from 'react';

export default function ComfyUIPage() {
  const [prompt, setPrompt] = useState('');
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt.');
      return;
    }
    setError(null);
    setLoading(true);
    setImageSrc(null);

    try {
      const res = await fetch('/api/prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      if (!res.ok) {
        throw new Error(await res.text());
      }
      const json = await res.json();
      const b64 = json.data[0].base64_png;
      setImageSrc(`data:image/png;base64,${b64}`);
    } catch (e: any) {
      console.error(e);
      setError(e.message || 'Generation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '1rem', background: '#111', color: '#eee', minHeight: '100vh' }}>
      <h1>ComfyUI Prompt</h1>
      <div style={{ display: 'flex', gap: '.5rem', marginBottom: '1rem' }}>
        <input
          style={{ flex: 1, padding: '.5rem', fontSize: '1rem' }}
          type="text"
          placeholder="Enter prompt…"
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
        />
        <button
          style={{ padding: '.5rem 1rem', fontSize: '1rem' }}
          onClick={generate}
          disabled={loading}
        >
          {loading ? 'Generating…' : 'Generate'}
        </button>
      </div>
      {error && <div style={{ color: 'salmon', marginBottom: '1rem' }}>{error}</div>}
      {imageSrc && (
        <div>
          <h2>Result</h2>
          <img src={imageSrc} alt="Generated" style={{ maxWidth: '100%' }} />
        </div>
      )}
      <div style={{ marginTop: '2rem' }}>
        <h2>Full ComfyUI Interface</h2>
        <iframe
          src="https://krh66gwxxg11qz-3000.proxy.runpod.net"
          style={{ width: '100%', height: '800px', border: '1px solid #444' }}
        />
      </div>
    </div>
  );
}
