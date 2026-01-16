
import React, { useState, useEffect } from 'react';
import { GoogleGenAI, Type } from "@google/genai";

interface Word {
  word: string;
  phonetic: string;
  definition: string;
  example: string;
}

const STATIC_WORDS: Word[] = [
  { word: "Ephemeral", phonetic: "/əˈfem(ə)rəl/", definition: "Lasting for a very short time.", example: "The ephemeral beauty of the sunset left the tourists in awe." },
  { word: "Petrichor", phonetic: "/ˈpetrəˌkôr/", definition: "A pleasant smell that frequently accompanies the first rain after a long period of warm, dry weather.", example: "The air was thick with the scent of petrichor as the storm approached." },
  { word: "Serendipity", phonetic: "/ˌserənˈdipədē/", definition: "The occurrence and development of events by chance in a happy or beneficial way.", example: "A fortunate stroke of serendipity led them to the hidden bookstore." },
  { word: "Luminous", phonetic: "/ˈlo͞omənəs/", definition: "Full of or shedding light; bright or shining, especially in the dark.", example: "The watch has luminous hands that glow in the dark." }
];

export const WordHub: React.FC = () => {
  const [primary, setPrimary] = useState<Word | null>(null);
  const [secondary, setSecondary] = useState<Word[]>([]);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'static' | 'ai'>('static');
  const [category, setCategory] = useState('Academic');

  const categories = ['Academic', 'Literary', 'Obscure', 'Slang', 'Archaic', 'Scientific'];

  const fetchStatic = () => {
    setLoading(true);
    setTimeout(() => {
      const shuffled = [...STATIC_WORDS].sort(() => 0.5 - Math.random());
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
        contents: `Recommend 4 unique words in the "${category}" category. One primary and three additional. Return as JSON array of objects with 'word', 'phonetic', 'definition', 'example'.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                word: { type: Type.STRING },
                phonetic: { type: Type.STRING },
                definition: { type: Type.STRING },
                example: { type: Type.STRING }
              },
              required: ['word', 'phonetic', 'definition', 'example']
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
    setCategory('Academic');
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
             <span className="text-[10px] uppercase tracking-[0.4em] text-neutral-600 font-bold">Forging Vocabulary...</span>
          </div>
        ) : primary ? (
          <section className="bg-[#0d0d0d] border border-neutral-800 p-10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
               <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-white"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" x2="15" y1="20" y2="20"/><line x1="12" x2="12" y1="4" y2="20"/></svg>
            </div>
            <div className="max-w-3xl space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-[10px] bg-indigo-500/10 text-indigo-400 px-2 py-0.5 border border-indigo-500/20 font-bold uppercase tracking-widest">{category}</span>
                <span className="text-[10px] text-neutral-600 font-mono">{primary.phonetic}</span>
              </div>
              <h2 className="text-5xl font-bold text-white tracking-tighter">{primary.word}</h2>
              <p className="text-lg text-neutral-400 leading-relaxed font-light">{primary.definition}</p>
              <p className="text-sm text-neutral-600 leading-relaxed italic border-l-2 border-neutral-800 pl-4 mt-4">"{primary.example}"</p>
            </div>
          </section>
        ) : null}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {secondary.map((w, i) => (
            <div key={i} className="bg-[#111] border border-neutral-800 p-6 space-y-3 hover:border-neutral-600 transition-colors">
              <div className="flex justify-between items-start">
                <span className="text-[9px] text-neutral-600 font-bold uppercase tracking-widest">{w.phonetic}</span>
                <span className="text-[9px] text-neutral-700 font-mono">/ word</span>
              </div>
              <h3 className="text-base font-bold text-neutral-200">{w.word}</h3>
              <p className="text-xs text-neutral-500 line-clamp-2">{w.definition}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
