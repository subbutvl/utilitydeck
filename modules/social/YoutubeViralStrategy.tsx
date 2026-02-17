
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";

export const YoutubeViralStrategy: React.FC = () => {
  const [niche, setNiche] = useState('');
  const [strategy, setStrategy] = useState('');
  const [loading, setLoading] = useState(false);

  const generateStrategy = async () => {
    if (!niche) return;
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Provide a detailed viral growth strategy for a YouTube channel in the "${niche}" niche. Include: 
        1. A 3-second hook idea.
        2. Content pacing advice.
        3. Strategic SEO keywords.
        4. Viral thumbnail concept description.
        5. Engagement tactics.
        Format in clean markdown.`,
      });
      setStrategy(response.text || '');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="bg-[var(--bg-card)] border border-[var(--border)] p-8 flex flex-col md:flex-row items-center gap-6">
        <div className="flex-1 w-full">
          <label className="text-[10px] uppercase text-[var(--text-muted)] font-bold mb-2 block tracking-widest">Channel Niche / Video Concept</label>
          <input value={niche} onChange={(e) => setNiche(e.target.value)} className="w-full bg-[var(--bg-input)] border border-[var(--border)] p-4 text-sm focus:border-[var(--border-hover)] outline-none" placeholder="e.g. AI Coding Tutorials, High-End Travel Vlogs..." />
        </div>
        <button onClick={generateStrategy} disabled={loading} className="w-full md:w-auto px-10 py-4 bg-white text-black font-bold uppercase tracking-widest text-xs disabled:opacity-50 transition-all hover:bg-neutral-200">Analyze & Strategize</button>
        <button onClick={() => {setNiche(''); setStrategy('')}} className="text-[10px] uppercase text-[var(--text-muted)] hover:text-red-500 font-bold tracking-widest">Reset</button>
      </div>

      <div className="flex-1 bg-[var(--bg-card)] border border-[var(--border)] p-10 overflow-y-auto">
        {strategy ? (
          <div className="prose prose-invert max-w-none text-[var(--text-primary)] leading-relaxed text-sm whitespace-pre-wrap">
            {strategy}
          </div>
        ) : (
          <div className="h-full flex items-center justify-center opacity-10 italic text-xl uppercase tracking-[0.5em] text-center">Strategic Roadmap Awaits</div>
        )}
      </div>
    </div>
  );
};
