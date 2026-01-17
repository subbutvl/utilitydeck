
import React, { useState, useEffect } from 'react';
import { GoogleGenAI, Type } from "@google/genai";

interface Quote {
  text: string;
  author: string;
}

export const QuotesGenerator: React.FC = () => {
  const [primary, setPrimary] = useState<Quote | null>(null);
  const [secondary, setSecondary] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'public' | 'ai'>('public');
  const [theme, setTheme] = useState('Philosophy & Life');
  const [error, setError] = useState<string | null>(null);

  const fetchPublicQuotes = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetching from the Public Quotes API
      const response = await fetch('https://api.freeapi.app/api/v1/public/quotes?page=1&limit=10');
      const result = await response.json();
      
      if (result.success && result.data && result.data.data) {
        const rawQuotes = result.data.data;
        const mappedQuotes = rawQuotes.map((q: any) => ({
          text: q.content,
          author: q.author
        })).sort(() => 0.5 - Math.random());

        setPrimary(mappedQuotes[0]);
        setSecondary(mappedQuotes.slice(1, 4));
      } else {
        throw new Error("Invalid API response structure");
      }
    } catch (err) {
      console.error("Public API Error:", err);
      setError("Failed to reach the Global Wisdom Feed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchAIQuotes = async () => {
    setLoading(true);
    setError(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Generate 4 inspiring and unique quotes about "${theme}". Return a JSON array of objects, each with 'text' and 'author' keys. Ensure the author is a real person or 'Unknown'.`,
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
      setPrimary(data[0]);
      setSecondary(data.slice(1, 4));
    } catch (err) {
      console.error("AI Generation failed:", err);
      setError("AI Synthesizer is currently busy. Switching to Global Feed.");
      setMode('public');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    if (mode === 'ai') fetchAIQuotes();
    else fetchPublicQuotes();
  };

  useEffect(() => {
    handleRefresh();
  }, [mode]);

  return (
    <div className="h-full flex flex-col gap-8">
      {/* Control Bar */}
      <div className="bg-[#111] border border-neutral-800 p-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="flex border border-neutral-800 p-1 bg-black">
            <button 
              onClick={() => setMode('public')} 
              className={`px-6 py-2.5 text-xs uppercase font-black tracking-widest transition-all ${mode === 'public' ? 'bg-neutral-800 text-white shadow-lg' : 'text-neutral-600 hover:text-white'}`}
            >
              Global Feed
            </button>
            <button 
              onClick={() => setMode('ai')} 
              className={`px-6 py-2.5 text-xs uppercase font-black tracking-widest transition-all ${mode === 'ai' ? 'bg-neutral-800 text-white shadow-lg' : 'text-neutral-600 hover:text-white'}`}
            >
              AI Lab
            </button>
          </div>

          {mode === 'ai' && (
            <div className="flex items-center gap-3">
              <label className="text-xs uppercase font-bold text-neutral-600 tracking-widest">Topic:</label>
              <input 
                type="text" 
                value={theme} 
                onChange={(e) => setTheme(e.target.value)} 
                className="bg-black border border-neutral-800 p-2.5 text-sm text-neutral-300 outline-none w-64 focus:border-indigo-500 transition-colors"
                placeholder="e.g. Courage, Tech, Solitude..."
              />
            </div>
          )}
        </div>

        <button 
          onClick={handleRefresh} 
          disabled={loading} 
          className="w-full md:w-auto px-10 py-3.5 bg-white text-black text-xs font-black uppercase tracking-[0.2em] hover:bg-neutral-200 transition-all disabled:opacity-30 flex items-center justify-center gap-3"
        >
          {loading ? (
            <>
              <div className="w-3 h-3 border-2 border-black/20 border-t-black animate-spin" />
              Syncing...
            </>
          ) : 'Refresh Wisdom'}
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 p-4 text-center">
           <p className="text-xs text-red-500 font-bold uppercase tracking-widest">{error}</p>
        </div>
      )}

      {/* Quote Display Area */}
      <div className="flex-1 overflow-auto pr-2 pb-24 custom-scrollbar">
        {primary ? (
          <section className="relative py-28 px-16 bg-[#0d0d0d] border border-neutral-800 text-center mb-12 animate-in fade-in slide-in-from-bottom-6 duration-1000 group">
            <div className="absolute top-10 left-16 text-[180px] font-serif text-neutral-900/40 leading-none pointer-events-none select-none group-hover:text-neutral-800 transition-colors">“</div>
            <blockquote className="relative z-10 space-y-12">
              <p className="text-4xl md:text-6xl font-light text-white leading-tight tracking-tight max-w-5xl mx-auto italic">
                {primary.text}
              </p>
              <cite className="text-sm uppercase tracking-[0.6em] font-black text-neutral-500 not-italic block border-t border-neutral-900 pt-8 w-fit mx-auto px-12">
                — {primary.author || 'Anonymous'}
              </cite>
            </blockquote>
            <div className="absolute bottom-6 right-8 flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
               <button onClick={() => navigator.clipboard.writeText(`"${primary.text}" — ${primary.author}`)} className="text-xs uppercase font-bold text-neutral-600 hover:text-white tracking-widest">Copy</button>
            </div>
          </section>
        ) : !loading && (
          <div className="h-64 flex items-center justify-center border border-dashed border-neutral-800 opacity-20 italic uppercase tracking-[0.5em]">
             No Data Segment Found
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {secondary.map((q, i) => (
            <div 
              key={i} 
              className="p-10 bg-[#111] border border-neutral-800 hover:border-neutral-600 transition-all flex flex-col gap-8 relative group"
            >
              <p className="text-xl text-neutral-400 leading-relaxed font-light italic">
                "{q.text}"
              </p>
              <div className="mt-auto pt-6 border-t border-neutral-900 flex justify-between items-center">
                <p className="text-xs uppercase font-black tracking-[0.2em] text-neutral-600 truncate mr-4">
                  {q.author || 'Unknown'}
                </p>
                <button 
                  onClick={() => navigator.clipboard.writeText(`"${q.text}" — ${q.author}`)}
                  className="opacity-0 group-hover:opacity-100 text-[10px] text-neutral-500 hover:text-white uppercase font-bold"
                >
                  Copy
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Info */}
      <div className="bg-neutral-900/30 p-4 border border-neutral-800 flex items-center justify-between text-xs text-neutral-600 uppercase tracking-widest font-bold">
        <span>Protocol: {mode === 'ai' ? 'GEMINI_LLM_SYNTH' : 'REST_PUBLIC_FETCH'}</span>
        <div className="flex items-center gap-4">
           <span className="flex items-center gap-2">
              <div className={`w-1.5 h-1.5 ${loading ? 'bg-yellow-500' : 'bg-green-500'} rounded-none shadow-[0_0_8px_rgba(34,197,94,0.3)]`} />
              Status: {loading ? 'Streaming' : 'Synchronized'}
           </span>
           <span className="opacity-30">/</span>
           <span>Mode: {mode.toUpperCase()}</span>
        </div>
      </div>
    </div>
  );
};
