
import React, { useState, useEffect } from 'react';
import { GoogleGenAI, Type } from "@google/genai";

interface Place {
  name: string;
  location: string;
  category: string;
  description: string;
}

const STATIC_PLACES: Place[] = [
  { name: "Kyoto", location: "Japan", category: "Historical", description: "Famous for its classical Buddhist temples, gardens, imperial palaces, Shinto shrines and traditional wooden houses." },
  { name: "Banff National Park", location: "Canada", category: "Nature", description: "Rocky Mountain peaks, turquoise glacial lakes, and a picture-perfect mountain town." },
  { name: "Petra", location: "Jordan", category: "Historical", description: "A historical and archaeological city in southern Jordan, famous for its rock-cut architecture and water conduit system." },
  { name: "The Maldives", location: "Indian Ocean", category: "Beach", description: "Tropical nation composed of 26 ring-shaped atolls, known for its beaches, blue lagoons and extensive reefs." }
];

export const PlaceRecommendation: React.FC = () => {
  const [primary, setPrimary] = useState<Place | null>(null);
  const [secondary, setSecondary] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'static' | 'ai'>('static');
  const [category, setCategory] = useState('Historical');

  const categories = ['Nature', 'City', 'Historical', 'Beach', 'Mountain', 'Hidden Gems'];

  const fetchStatic = () => {
    setLoading(true);
    setTimeout(() => {
      const pool = STATIC_PLACES.filter(p => p.category === category || category === 'All').length > 0 ? STATIC_PLACES.filter(p => p.category === category) : STATIC_PLACES;
      const shuffled = [...pool].sort(() => 0.5 - Math.random());
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
        contents: `Recommend 4 travel places in the "${category}" category. One primary and three additional. Return as JSON array of objects with 'name', 'location', 'category', 'description'.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                location: { type: Type.STRING },
                category: { type: Type.STRING },
                description: { type: Type.STRING }
              },
              required: ['name', 'location', 'category', 'description']
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
    setCategory('Historical');
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
             <span className="text-[10px] uppercase tracking-[0.4em] text-neutral-600 font-bold">Scanning Globe...</span>
          </div>
        ) : primary ? (
          <section className="bg-[#0d0d0d] border border-neutral-800 p-10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
               <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-white"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            </div>
            <div className="max-w-3xl space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-[10px] bg-indigo-500/10 text-indigo-400 px-2 py-0.5 border border-indigo-500/20 font-bold uppercase tracking-widest">{primary.category}</span>
                <span className="text-[10px] text-neutral-600 font-mono">Location: {primary.location}</span>
              </div>
              <h2 className="text-5xl font-bold text-white tracking-tighter">{primary.name}</h2>
              <p className="text-lg text-neutral-400 leading-relaxed italic">{primary.description}</p>
            </div>
          </section>
        ) : null}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {secondary.map((p, i) => (
            <div key={i} className="bg-[#111] border border-neutral-800 p-6 space-y-3 hover:border-neutral-600 transition-colors">
              <div className="flex justify-between items-start">
                <span className="text-[9px] text-neutral-600 font-bold uppercase tracking-widest">{p.category}</span>
                <span className="text-[9px] text-neutral-700 font-mono">/ {p.location}</span>
              </div>
              <h3 className="text-base font-bold text-neutral-200">{p.name}</h3>
              <p className="text-xs text-neutral-500 line-clamp-2">{p.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
