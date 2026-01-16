
import React, { useState, useEffect } from 'react';
import { GoogleGenAI, Type } from "@google/genai";

interface Bird {
  name: string;
  species: string;
  habitat: string;
  description: string;
}

const STATIC_BIRDS: Bird[] = [
  { name: "Peregrine Falcon", species: "Falco peregrinus", habitat: "Mountains & Cliffs", description: "The fastest animal on the planet, reaching speeds of over 200 mph during its characteristic hunting dive." },
  { name: "Kingfisher", species: "Alcedinidae", habitat: "Rivers & Lakes", description: "Small brightly colored birds known for their ability to dive into water to catch fish with great precision." },
  { name: "Great Horned Owl", species: "Bubo virginianus", habitat: "Woodlands", description: "Powerful predator with distinctive ear tufts and large yellow eyes, capable of hunting prey much larger than itself." },
  { name: "Flamingo", species: "Phoenicopterus", habitat: "Saline Lagoons", description: "Tall pink birds known for standing on one leg and filter-feeding in shallow alkaline waters." }
];

export const BirdHub: React.FC = () => {
  const [primary, setPrimary] = useState<Bird | null>(null);
  const [secondary, setSecondary] = useState<Bird[]>([]);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'static' | 'ai'>('static');
  const [category, setCategory] = useState('Songbirds');

  const categories = ['Songbirds', 'Raptors', 'Tropical', 'Urban', 'Waterfowl', 'Flightless'];

  const fetchStatic = () => {
    setLoading(true);
    setTimeout(() => {
      const shuffled = [...STATIC_BIRDS].sort(() => 0.5 - Math.random());
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
        contents: `Recommend 4 birds in the "${category}" category. One primary and three additional. Return as JSON array of objects with 'name', 'species', 'habitat', 'description'.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                species: { type: Type.STRING },
                habitat: { type: Type.STRING },
                description: { type: Type.STRING }
              },
              required: ['name', 'species', 'habitat', 'description']
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
    setCategory('Songbirds');
    setMode('static');
  };

  return (
    <div className="h-full flex flex-col gap-6">
      {mode === 'static' && (
        <div className="bg-indigo-900/20 border border-indigo-500/20 px-4 py-2 text-[10px] text-indigo-300 uppercase font-bold tracking-widest text-center animate-in fade-in slide-in-from-top-1">
          Currently viewing curated static content. Real-time dynamic API integration is coming soon.
        </div>
      )}

      <div className="bg-[#111] border border-neutral-800 p-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {categories.map(cat => (
            <button key={cat} onClick={() => setCategory(cat)} className={`px-4 py-1.5 border shrink-0 text-[10px] uppercase font-bold tracking-widest transition-all ${category === cat ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-neutral-900 text-neutral-500 border-neutral-800'}`}>
              {cat}
            </button>
          ))}
        </div>
        <div className="flex gap-4">
          <div className="flex border border-neutral-800 p-1 bg-black">
            <button onClick={() => setMode('static')} className={`px-4 py-1 text-[10px] uppercase font-bold transition-all ${mode === 'static' ? 'bg-neutral-800 text-white' : 'text-neutral-600'}`}>Curated</button>
            <button onClick={() => setMode('ai')} className={`px-4 py-1 text-[10px] uppercase font-bold transition-all ${mode === 'ai' ? 'bg-neutral-800 text-white' : 'text-neutral-600'}`}>AI Lab</button>
          </div>
          <button onClick={resetAll} className="text-[10px] uppercase font-bold text-neutral-700 hover:text-red-500">Reset</button>
          <button onClick={() => mode === 'ai' ? fetchAI() : fetchStatic()} className="text-[10px] uppercase font-bold text-neutral-400 hover:text-white underline underline-offset-4">Refresh</button>
        </div>
      </div>

      <div className="flex-1 overflow-auto space-y-8 pb-20">
        {loading ? (
          <div className="h-64 animate-pulse bg-neutral-900 border border-neutral-800 flex items-center justify-center">
             <span className="text-[10px] uppercase tracking-[0.4em] text-neutral-600 font-bold">Tracking Migration...</span>
          </div>
        ) : primary ? (
          <section className="bg-[#0d0d0d] border border-neutral-800 p-10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
               <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-white"><path d="M16 7c-1.5 0-3-1-4.5-2a4.66 4.66 0 0 0-6.06 1.15c-.45.54-.51 1.25-.13 1.84.44.66.71 1.43.78 2.22l.14 1.5c.12 1.25.53 2.45 1.2 3.53l.36.57c.56.88 1.55 1.41 2.61 1.4h3.6c.92 0 1.8-.4 2.4-1.1l2.4-2.8a4.13 4.13 0 0 0 1.05-3.04c-.11-1.3-.87-2.45-1.99-3.11l-1.05-.62A3.26 3.26 0 0 0 16 7z"/><path d="m11 13 4-2"/></svg>
            </div>
            <div className="max-w-3xl space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-0.5 border border-blue-500/20 font-bold uppercase tracking-widest">{primary.habitat}</span>
                <span className="text-[10px] text-neutral-600 font-mono italic">{primary.species}</span>
              </div>
              <h2 className="text-5xl font-bold text-white tracking-tighter">{primary.name}</h2>
              <p className="text-lg text-neutral-400 leading-relaxed italic">{primary.description}</p>
            </div>
          </section>
        ) : null}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {secondary.map((b, i) => (
            <div key={i} className="bg-[#111] border border-neutral-800 p-6 space-y-3 hover:border-neutral-600 transition-colors">
              <div className="flex justify-between items-start">
                <span className="text-[9px] text-neutral-600 font-bold uppercase tracking-widest truncate max-w-[120px]">{b.habitat}</span>
                <span className="text-[9px] text-neutral-700 font-mono">/ species</span>
              </div>
              <h3 className="text-base font-bold text-neutral-200">{b.name}</h3>
              <p className="text-xs text-neutral-500 line-clamp-2">{b.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
