
import React, { useState, useEffect } from 'react';
import { GoogleGenAI, Type } from "@google/genai";

interface Fact {
  fact: string;
  source?: string;
  category: string;
}

const STATIC_FACTS: Fact[] = [
  { fact: "A single bolt of lightning contains enough energy to toast 100,000 slices of bread.", category: "Nature" },
  { fact: "Honey never spoils. Archaeologists have found edible honey in ancient Egyptian tombs.", category: "Nature" },
  { fact: "There are more possible iterations of a game of chess than there are atoms in the known universe.", category: "Technology" },
  { fact: "The shortest war in history lasted only 38 minutes between Britain and Zanzibar in 1896.", category: "History" }
];

export const RandomFacts: React.FC = () => {
  const [primary, setPrimary] = useState<Fact | null>(null);
  const [secondary, setSecondary] = useState<Fact[]>([]);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'static' | 'ai'>('static');
  const [category, setCategory] = useState('Nature');

  const categories = ['Space', 'Human Body', 'History', 'Nature', 'Technology', 'Animals'];

  const fetchStatic = () => {
    setLoading(true);
    setTimeout(() => {
      const pool = STATIC_FACTS.filter(f => f.category === category || category === 'All').length > 0 ? STATIC_FACTS.filter(f => f.category === category) : STATIC_FACTS;
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
        contents: `Share 4 mind-bending random facts about "${category}". One primary and three additional. Return as JSON array of objects with 'fact', 'category'.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                fact: { type: Type.STRING },
                category: { type: Type.STRING }
              },
              required: ['fact', 'category']
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
    setCategory('Nature');
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
             <span className="text-[10px] uppercase tracking-[0.4em] text-[var(--text-muted)] font-bold">Unlocking Vault...</span>
          </div>
        ) : primary ? (
          <section className="bg-[#0d0d0d] border border-[var(--border)] p-12 relative overflow-hidden group text-center">
            <div className="absolute top-0 left-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
               <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-[var(--text-primary)]"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="16" y2="12"/><line x1="12" x2="12.01" y1="8" y2="8"/></svg>
            </div>
            <div className="max-w-4xl mx-auto space-y-6">
              <span className="text-[10px] bg-indigo-500/10 text-indigo-400 px-3 py-1 border border-indigo-500/20 font-bold uppercase tracking-widest">{primary.category} Vault</span>
              <p className="text-3xl md:text-5xl font-light text-[var(--text-primary)] leading-tight tracking-tight">{primary.fact}</p>
            </div>
          </section>
        ) : null}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {secondary.map((f, i) => (
            <div key={i} className="bg-[var(--bg-card)] border border-[var(--border)] p-6 space-y-4 hover:border-[var(--border-hover)] transition-colors flex flex-col justify-center">
              <span className="text-[9px] text-[var(--text-muted)] font-bold uppercase tracking-widest">{f.category}</span>
              <p className="text-sm text-[var(--text-primary)] leading-relaxed italic">"{f.fact}"</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
