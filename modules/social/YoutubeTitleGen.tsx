
import React, { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";

export const YoutubeTitleGen: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [audience, setAudience] = useState('Beginners');
  const [titles, setTitles] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const generateTitles = async () => {
    if (!topic) return;
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Generate 10 high-CTR YouTube titles for a video about "${topic}". The target audience is "${audience}". Focus on curiosity, emotion, or utility. Use clear formatting.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        }
      });
      setTitles(JSON.parse(response.text));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const clearAll = () => {
    setTopic('');
    setTitles([]);
  };

  return (
    <div className="max-w-4xl mx-auto w-full flex flex-col gap-8 pt-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-[var(--bg-card)] border border-[var(--border)] p-8 space-y-6">
          <h2 className="text-xs uppercase tracking-widest text-[var(--text-muted)] font-bold mb-4">Configuration</h2>
          <div>
            <label className="text-[10px] uppercase text-[var(--text-muted)] font-bold mb-2 block tracking-widest">Video Topic</label>
            <textarea value={topic} onChange={(e) => setTopic(e.target.value)} className="w-full bg-[var(--bg-input)] border border-[var(--border)] p-4 text-sm focus:border-[var(--border-hover)] outline-none h-32 resize-none" placeholder="What is your video about?" />
          </div>
          <div>
            <label className="text-[10px] uppercase text-[var(--text-muted)] font-bold mb-2 block tracking-widest">Target Audience</label>
            <input value={audience} onChange={(e) => setAudience(e.target.value)} className="w-full bg-[var(--bg-input)] border border-[var(--border)] p-4 text-sm focus:border-[var(--border-hover)] outline-none" />
          </div>
          <div className="flex gap-4">
            <button onClick={generateTitles} disabled={loading} className="flex-1 py-4 bg-white text-black font-bold uppercase tracking-widest text-xs disabled:opacity-50">Generate Titles</button>
            <button onClick={clearAll} className="px-6 border border-[var(--border)] text-[var(--text-muted)] hover:text-red-500 transition-colors uppercase text-[10px] font-bold tracking-widest">Clear</button>
          </div>
        </div>

        <div className="flex flex-col">
          <h2 className="text-xs uppercase tracking-widest text-[var(--text-muted)] font-bold mb-4">Results</h2>
          <div className="flex-1 bg-[var(--bg-card)]/50 border border-[var(--border)] p-6 overflow-y-auto min-h-[400px]">
            {titles.length > 0 ? (
              <div className="space-y-4">
                {titles.map((t, i) => (
                  <div key={i} className="group relative bg-[var(--bg-input)] border border-[var(--border)] p-4 hover:border-[var(--border-hover)] transition-all">
                    <p className="text-sm text-[var(--text-primary)]">{t}</p>
                    <button onClick={() => navigator.clipboard.writeText(t)} className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-[9px] uppercase tracking-widest text-[var(--text-muted)] hover:text-[var(--text-primary)]">Copy</button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center opacity-20 italic text-xs uppercase tracking-widest">Titles will appear here</div>
            )}
          </div>
        </div>
      </div>
      <div className="p-4 bg-[var(--bg-card)] border border-[var(--border)] text-[10px] text-[var(--text-muted)] uppercase tracking-widest text-center">AI generated titles optimized for the current YouTube algorithm.</div>
    </div>
  );
};
