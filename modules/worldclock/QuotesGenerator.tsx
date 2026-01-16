
import React, { useState, useEffect } from 'react';
import { GoogleGenAI, Type } from "@google/genai";

interface Quote {
  text: string;
  author: string;
  category?: string;
}

const STATIC_QUOTES: Quote[] = [
  { text: "Simplicity is the ultimate sophistication.", author: "Leonardo da Vinci" },
  { text: "Design is not just what it looks like and feels like. Design is how it works.", author: "Steve Jobs" },
  { text: "The details are not the details. They make the design.", author: "Charles Eames" },
  { text: "Good design is obvious. Great design is transparent.", author: "Joe Sparano" },
  { text: "Content precedes design. Design in the absence of content is not design, it’s decoration.", author: "Jeffrey Zeldman" }
];

export const QuotesGenerator: React.FC = () => {
  const [primaryQuote, setPrimaryQuote] = useState<Quote | null>(null);
  const [secondaryQuotes, setSecondaryQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'static' | 'ai'>('static');
  const [theme, setTheme] = useState('Wisdom & Growth');

  const fetchStaticQuotes = () => {
    setLoading(true);
    // Simulate network delay
    setTimeout(() => {
      const shuffled = [...STATIC_QUOTES].sort(() => 0.5 - Math.random());
      setPrimaryQuote(shuffled[0]);
      setSecondaryQuotes(shuffled.slice(1, 4));
      setLoading(false);
    }, 500);
  };

  const fetchAIQuotes = async () => {
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Generate 4 unique and inspiring quotes about "${theme}". One should be very profound. Return as JSON array of objects with 'text' and 'author'.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                text: { type: Type.STRING },
                author: { type: Type.STRING }
              },
              required: ['text', 'author']
            }
          }
        }
      });
      const data = JSON.parse(response.text);
      setPrimaryQuote(data[0]);
      setSecondaryQuotes(data.slice(1));
    } catch (err) {
      console.error(err);
      fetchStaticQuotes(); // Fallback
    } finally {
      setLoading(false);
    }
  };

  const refresh = () => {
    if (mode === 'ai') fetchAIQuotes();
    else fetchStaticQuotes();
  };

  const resetAll = () => {
    setPrimaryQuote(null);
    setSecondaryQuotes([]);
    setTheme('Wisdom & Growth');
    setMode('static');
  };

  useEffect(() => {
    fetchStaticQuotes();
  }, []);

  return (
    <div className="h-full flex flex-col gap-8">
      {/* Header / Config */}
      <div className="bg-[#111] border border-neutral-800 p-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="flex border border-neutral-800 p-1 bg-black">
            <button 
              onClick={() => setMode('static')}
              className={`px-4 py-1.5 text-[10px] uppercase font-bold tracking-widest transition-all ${mode === 'static' ? 'bg-neutral-800 text-white' : 'text-neutral-600 hover:text-white'}`}
            >
              Curated
            </button>
            <button 
              onClick={() => setMode('ai')}
              className={`px-4 py-1.5 text-[10px] uppercase font-bold tracking-widest transition-all ${mode === 'ai' ? 'bg-neutral-800 text-white' : 'text-neutral-600 hover:text-white'}`}
            >
              AI Lab
            </button>
          </div>
          
          {mode === 'ai' && (
            <input 
              type="text"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              placeholder="Quote theme (e.g. Courage)..."
              className="bg-black border border-neutral-800 p-2 text-xs text-neutral-300 outline-none focus:border-neutral-600 w-48"
            />
          )}
        </div>

        <div className="flex gap-4">
          <button 
            onClick={refresh}
            disabled={loading}
            className="px-8 py-2.5 bg-white text-black text-[11px] font-bold uppercase tracking-widest hover:bg-neutral-200 transition-all disabled:opacity-30"
          >
            {loading ? 'Fetching...' : 'Generate New'}
          </button>
          <button 
            onClick={resetAll}
            className="text-[10px] uppercase font-bold text-neutral-600 hover:text-red-500 transition-colors"
          >
            Reset Tool
          </button>
        </div>
      </div>

      {/* Primary Quote Area */}
      <div className="flex-1 overflow-auto pr-1">
        <div className="max-w-4xl mx-auto space-y-12 pb-20">
          {primaryQuote ? (
            <section className="relative py-20 px-12 bg-[#0d0d0d] border border-neutral-800 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="absolute top-8 left-12 text-8xl font-serif text-neutral-800 leading-none pointer-events-none">“</div>
              <blockquote className="relative z-10">
                <p className="text-3xl md:text-5xl font-light text-white leading-tight tracking-tight mb-8">
                  {primaryQuote.text}
                </p>
                <cite className="text-[11px] uppercase tracking-[0.4em] font-bold text-neutral-600 not-italic">
                  — {primaryQuote.author}
                </cite>
              </blockquote>
              <div className="absolute bottom-8 right-12 text-8xl font-serif text-neutral-800 leading-none rotate-180 pointer-events-none">“</div>
            </section>
          ) : (
            <div className="h-64 flex items-center justify-center border border-dashed border-neutral-800 opacity-20 italic">
               Waiting for inspiration...
            </div>
          )}

          {/* Secondary Quotes Grid */}
          <section className="space-y-6">
            <div className="flex items-center gap-4">
               <h2 className="text-[10px] uppercase font-bold text-neutral-600 tracking-[0.3em] whitespace-nowrap">Further Reflections</h2>
               <div className="h-px w-full bg-neutral-900" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {secondaryQuotes.length > 0 ? secondaryQuotes.map((q, i) => (
                <div key={i} className="p-8 bg-[#111] border border-neutral-800 group hover:border-neutral-600 transition-all flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-500" style={{ animationDelay: `${i * 150}ms` }}>
                  <p className="text-sm text-neutral-400 leading-relaxed italic">
                    "{q.text}"
                  </p>
                  <p className="text-[9px] uppercase font-bold tracking-widest text-neutral-700 mt-auto border-t border-neutral-900 pt-4">
                    {q.author}
                  </p>
                </div>
              )) : Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-40 border border-neutral-900 bg-neutral-950/50 animate-pulse" />
              ))}
            </div>
          </section>
        </div>
      </div>

      <div className="bg-neutral-900/30 p-3 border border-neutral-800 text-[9px] text-neutral-700 uppercase tracking-widest font-bold text-center">
        {mode === 'ai' ? 'AI Perspectives: Real-time synthesis via Gemini 3.0' : 'Curated Wisdom: Expert selections from historical archives'}
      </div>
    </div>
  );
};
