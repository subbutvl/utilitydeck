
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";

export const InstagramGen: React.FC = () => {
  const [mode, setMode] = useState<'ai' | 'template'>('ai');
  const [input, setInput] = useState('');
  const [vibe, setVibe] = useState('Minimalist');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const generateAI = async () => {
    if (!input) return;
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Create a viral Instagram caption and 15 hashtags for: "${input}". Vibe: ${vibe}. Include emojis and line breaks for readability.`,
      });
      setResult(response.text || '');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const useTemplate = (t: string) => {
    const templates: any = {
      curiosity: `Wait until you see the end of this... 🤯\n\n[Details about ${input}]\n\nTag a friend who needs this!\n\n#niche #instagram #growth`,
      educational: `Did you know? 💡\n\n[Fact about ${input}]\n\nSave this for later so you don't forget!\n\n#learning #tips #value`,
      minimal: `${input} ✨\n\n.\n.\n.\n#aesthetic #vibes`
    };
    setResult(templates[t] || '');
  };

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="flex border-b border-[var(--border)]">
        <button onClick={() => setMode('ai')} className={`px-6 py-3 text-[11px] uppercase tracking-widest font-bold ${mode === 'ai' ? 'border-b-2 border-white text-[var(--text-primary)]' : 'text-[var(--text-muted)]'}`}>AI Copywriter</button>
        <button onClick={() => setMode('template')} className={`px-6 py-3 text-[11px] uppercase tracking-widest font-bold ${mode === 'template' ? 'border-b-2 border-white text-[var(--text-primary)]' : 'text-[var(--text-muted)]'}`}>Framework Templates</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-1 min-h-0">
        <div className="bg-[var(--bg-card)] border border-[var(--border)] p-8 flex flex-col gap-6">
          <textarea value={input} onChange={(e) => setInput(e.target.value)} className="w-full bg-[var(--bg-input)] border border-[var(--border)] p-4 text-sm focus:border-[var(--border-hover)] outline-none h-40 resize-none" placeholder="What is your post about?" />
          
          {mode === 'ai' ? (
            <>
              <select value={vibe} onChange={(e) => setVibe(e.target.value)} className="w-full bg-[var(--bg-input)] border border-[var(--border)] p-4 text-xs uppercase tracking-widest">
                <option>Minimalist</option>
                <option>Hype / Energetic</option>
                <option>Funny / Sarcastic</option>
                <option>Professional</option>
              </select>
              <button onClick={generateAI} disabled={loading} className="w-full py-4 bg-white text-black font-bold uppercase tracking-widest text-xs">Generate Viral Copy</button>
            </>
          ) : (
            <div className="grid grid-cols-1 gap-2">
              <button onClick={() => useTemplate('curiosity')} className="p-3 border border-[var(--border)] hover:bg-[var(--bg-card)] text-xs text-left uppercase tracking-widest">Curiosity Gap Framework</button>
              <button onClick={() => useTemplate('educational')} className="p-3 border border-[var(--border)] hover:bg-[var(--bg-card)] text-xs text-left uppercase tracking-widest">Educational Value Block</button>
              <button onClick={() => useTemplate('minimal')} className="p-3 border border-[var(--border)] hover:bg-[var(--bg-card)] text-xs text-left uppercase tracking-widest">Ultra Minimal Aesthetic</button>
            </div>
          )}
          <button onClick={() => {setInput(''); setResult('')}} className="mt-auto text-[10px] uppercase text-[var(--text-muted)] hover:text-red-500 font-bold transition-colors">Clear All</button>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex-1 bg-[var(--bg-input)] border border-[var(--border)] p-8 overflow-y-auto relative">
            {result ? (
              <div className="whitespace-pre-wrap text-sm text-[var(--text-primary)] leading-relaxed">{result}</div>
            ) : (
              <div className="h-full flex items-center justify-center opacity-20 italic text-xs uppercase tracking-[0.2em]">Ready for your content</div>
            )}
            {result && (
              <button onClick={() => navigator.clipboard.writeText(result)} className="absolute top-4 right-4 text-[10px] uppercase text-[var(--text-muted)] hover:text-[var(--text-primary)] font-bold">Copy Content</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
