
import React, { useState, useEffect } from 'react';
import { GoogleGenAI, Type } from "@google/genai";

interface Kural {
  number: string;
  tamil: string;
  translation: string;
  explanation: string;
}

const STATIC_KURAL: Kural[] = [
  { 
    number: "1", 
    tamil: "அகர முதல எழுத்தெல்லாம் ஆதி\nபகவன் முதற்றே உலகு.", 
    translation: "A, as its first of letters, every speech maintains; The Primal Deity is First through all the world's domains.",
    explanation: "Just as the letter 'A' is the beginning of all letters, God is the beginning of the world."
  },
  { 
    number: "2", 
    tamil: "கற்றதனால் ஆய பயனென்கொல் வாலறிவன்\nநற்றாள் தொழாஅர் எனின்.", 
    translation: "No fruit have men of all their studied lore, Save they the Purely Wise One's feet adore.",
    explanation: "What profit have those derived from learning, who worship not the good feet of Him who is possessed of pure knowledge?"
  },
  { 
    number: "10", 
    tamil: "பிறவிப் பெருங்கடல் நீந்துவர் நீந்தார்\nஇறைவன் அடிசேரா தார்.", 
    translation: "They swim the sea of births, the Monach's foot who gain; None else the ocean of embodied rebirth swim in vain.",
    explanation: "None can swim the great sea of births but those who combined to the feet of God."
  },
  { 
    number: "391", 
    tamil: "கற்க கசடறக் கற்பவை கற்றபின்\nநிற்க அதற்குத் தக.", 
    translation: "So learn that you may full and faultless learning gain; Then in obedience to the lessons learnt remain.",
    explanation: "Learn with a perfect mind and without doubt; and after you have learned, let your conduct be worthy of your learning."
  }
];

export const TirukuralHub: React.FC = () => {
  const [primary, setPrimary] = useState<Kural | null>(null);
  const [secondary, setSecondary] = useState<Kural[]>([]);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'static' | 'ai'>('static');
  const [category, setCategory] = useState('Virtue');

  const categories = ['Virtue', 'Wealth', 'Love', 'Ethics', 'Wisdom', 'Governance'];

  const fetchStatic = () => {
    setLoading(true);
    setTimeout(() => {
      const shuffled = [...STATIC_KURAL].sort(() => 0.5 - Math.random());
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
        contents: `Recommend 4 couplets from the Tirukural in the "${category}" section. One primary and three additional. Provide the Tamil text, English translation, and a concise explanation. Return as JSON array of objects with 'number', 'tamil', 'translation', 'explanation'.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                number: { type: Type.STRING },
                tamil: { type: Type.STRING },
                translation: { type: Type.STRING },
                explanation: { type: Type.STRING }
              },
              required: ['number', 'tamil', 'translation', 'explanation']
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
    setCategory('Virtue');
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
             <span className="text-[10px] uppercase tracking-[0.4em] text-[var(--text-muted)] font-bold">Translating Ancient Wisdom...</span>
          </div>
        ) : primary ? (
          <section className="bg-[#0d0d0d] border border-[var(--border)] p-10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
               <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-[var(--text-primary)]"><path d="M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18z"/><path d="M12 7v5l3 3"/></svg>
            </div>
            <div className="max-w-3xl space-y-8">
              <div className="flex items-center gap-3">
                <span className="text-[10px] bg-indigo-500/10 text-indigo-400 px-2 py-0.5 border border-indigo-500/20 font-bold uppercase tracking-widest">Kural {primary.number}</span>
                <span className="text-[10px] text-[var(--text-muted)] font-mono tracking-widest">{category}</span>
              </div>
              <div className="space-y-4">
                 <p className="text-3xl font-bold text-[var(--text-primary)] tracking-tight whitespace-pre-wrap leading-snug">{primary.tamil}</p>
                 <div className="h-px w-12 bg-[var(--bg-hover)]" />
                 <p className="text-lg text-[var(--text-muted)] leading-relaxed font-light italic">"{primary.translation}"</p>
                 <p className="text-sm text-[var(--text-muted)] leading-relaxed pt-4 border-t border-[var(--border)]">{primary.explanation}</p>
              </div>
            </div>
          </section>
        ) : null}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {secondary.map((k, i) => (
            <div key={i} className="bg-[var(--bg-card)] border border-[var(--border)] p-6 space-y-3 hover:border-[var(--border-hover)] transition-colors">
              <div className="flex justify-between items-start">
                <span className="text-[9px] text-[var(--text-muted)] font-bold uppercase tracking-widest">Kural {k.number}</span>
              </div>
              <h3 className="text-sm font-bold text-[var(--text-primary)] line-clamp-2">{k.tamil}</h3>
              <p className="text-[10px] text-[var(--text-muted)] italic line-clamp-2 leading-relaxed">"{k.translation}"</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
