
import React, { useState, useEffect } from 'react';
import { GoogleGenAI, Type } from "@google/genai";

interface SpaceObject {
  name: string;
  type: string;
  distance: string;
  description: string;
}

const STATIC_SPACE: SpaceObject[] = [
  { name: "Andromeda Galaxy", type: "Spiral Galaxy", distance: "2.537 Million Light Years", description: "The nearest large galaxy to our Milky Way, expected to collide with us in about 4.5 billion years." },
  { name: "Pillars of Creation", type: "Nebula", distance: "6,500 Light Years", description: "A famous region of the Eagle Nebula where stars are actively forming inside giant clouds of gas and dust." },
  { name: "Sagittarius A*", type: "Supermassive Black Hole", distance: "26,670 Light Years", description: "The massive black hole at the center of the Milky Way, recently imaged by the Event Horizon Telescope." },
  { name: "Europa", type: "Moon of Jupiter", distance: "628 Million km", description: "An icy moon believed to have a subsurface liquid water ocean that could potentially harbor life." }
];

export const SpaceHub: React.FC = () => {
  const [primary, setPrimary] = useState<SpaceObject | null>(null);
  const [secondary, setSecondary] = useState<SpaceObject[]>([]);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'static' | 'ai'>('static');
  const [category, setCategory] = useState('Planets');

  const categories = ['Planets', 'Nebulae', 'Stars', 'Missions', 'Galaxies', 'Exoplanets'];

  const fetchStatic = () => {
    setLoading(true);
    setTimeout(() => {
      const shuffled = [...STATIC_SPACE].sort(() => 0.5 - Math.random());
      setPrimary(shuffled[0]);
      setSecondary(shuffled.slice(1, 4));
      setLoading(false);
    }, 500);
  };

  const fetchAI = async () => {
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Recommend 4 celestial objects or missions in the "${category}" category. One primary and three additional. Return as JSON array of objects with 'name', 'type', 'distance', 'description'.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                type: { type: Type.STRING },
                distance: { type: Type.STRING },
                description: { type: Type.STRING }
              },
              required: ['name', 'type', 'distance', 'description']
            }
          }
        }
      });
      const data = JSON.parse(response.text);
      setPrimary(data[0]);
      setSecondary(data.slice(1));
    } catch (err) {
      fetchStatic();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (mode === 'ai') fetchAI(); else fetchStatic();
  }, [category, mode]);

  const resetAll = () => {
    setCategory('Planets');
    setMode('static');
  };

  return (
    <div className="h-full flex flex-col gap-6">
      {mode === 'static' && (
        <div className="bg-indigo-900/20 border border-indigo-500/20 px-4 py-2 text-[10px] text-indigo-300 uppercase font-bold tracking-widest text-center animate-in fade-in slide-in-from-top-1">
          Currently viewing curated static content. Real-time dynamic API integration is coming soon.
        </div>
      )}

      <div className="bg-[var(--bg-card)] border border-[var(--border)] p-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {categories.map(cat => (
            <button key={cat} onClick={() => setCategory(cat)} className={`px-4 py-1.5 border shrink-0 text-[10px] uppercase font-bold tracking-widest transition-all ${category === cat ? 'bg-indigo-600 text-[var(--text-primary)] border-indigo-600' : 'bg-[var(--bg-card)] text-[var(--text-muted)] border-[var(--border)]'}`}>
              {cat}
            </button>
          ))}
        </div>
        <div className="flex gap-4">
          <div className="flex border border-[var(--border)] p-1 bg-[var(--bg-input)]">
            <button onClick={() => setMode('static')} className={`px-4 py-1 text-[10px] uppercase font-bold transition-all ${mode === 'static' ? 'bg-[var(--bg-hover)] text-[var(--text-primary)]' : 'text-[var(--text-muted)]'}`}>Curated</button>
            <button onClick={() => setMode('ai')} className={`px-4 py-1 text-[10px] uppercase font-bold transition-all ${mode === 'ai' ? 'bg-[var(--bg-hover)] text-[var(--text-primary)]' : 'text-[var(--text-muted)]'}`}>AI Lab</button>
          </div>
          <button onClick={resetAll} className="text-[10px] uppercase font-bold text-[var(--text-muted)] hover:text-red-500">Reset</button>
          <button onClick={() => mode === 'ai' ? fetchAI() : fetchStatic()} className="text-[10px] uppercase font-bold text-[var(--text-muted)] hover:text-[var(--text-primary)] underline underline-offset-4">Refresh</button>
        </div>
      </div>

      <div className="flex-1 overflow-auto space-y-8 pb-20">
        {loading ? (
          <div className="h-64 animate-pulse bg-[var(--bg-card)] border border-[var(--border)] flex items-center justify-center">
             <span className="text-[10px] uppercase tracking-[0.4em] text-[var(--text-muted)] font-bold">Warping Through Space...</span>
          </div>
        ) : primary ? (
          <section className="bg-[#0d0d0d] border border-[var(--border)] p-10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
               <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-[var(--text-primary)]"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
            </div>
            <div className="max-w-3xl space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-[10px] bg-purple-500/10 text-purple-400 px-2 py-0.5 border border-purple-500/20 font-bold uppercase tracking-widest">{primary.type}</span>
                <span className="text-[10px] text-[var(--text-muted)] font-mono">{primary.distance}</span>
              </div>
              <h2 className="text-5xl font-bold text-[var(--text-primary)] tracking-tighter">{primary.name}</h2>
              <p className="text-lg text-[var(--text-muted)] leading-relaxed italic">{primary.description}</p>
            </div>
          </section>
        ) : null}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {secondary.map((s, i) => (
            <div key={i} className="bg-[var(--bg-card)] border border-[var(--border)] p-6 space-y-3 hover:border-[var(--border-hover)] transition-colors">
              <div className="flex justify-between items-start">
                <span className="text-[9px] text-[var(--text-muted)] font-bold uppercase tracking-widest truncate max-w-[120px]">{s.type}</span>
                <span className="text-[9px] text-[var(--text-muted)] font-mono">/ target</span>
              </div>
              <h3 className="text-base font-bold text-[var(--text-primary)]">{s.name}</h3>
              <p className="text-xs text-[var(--text-muted)] line-clamp-2">{s.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
