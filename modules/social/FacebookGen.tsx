
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";

export const FacebookGen: React.FC = () => {
  const [goal, setGoal] = useState('Engagement');
  const [context, setContext] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const generateCopy = async () => {
    if (!context) return;
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Generate a professional Facebook post copy with the goal of "${goal}" for the following context: "${context}". Use appropriate emojis and a clear Call to Action (CTA).`,
      });
      setResult(response.text || '');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-8 pt-4">
      <div className="md:col-span-5 bg-[var(--bg-card)] border border-[var(--border)] p-8 space-y-6 h-fit">
        <div>
          <label className="text-[10px] uppercase text-[var(--text-muted)] font-bold mb-2 block tracking-widest">Campaign Goal</label>
          <select value={goal} onChange={(e) => setGoal(e.target.value)} className="w-full bg-[var(--bg-input)] border border-[var(--border)] p-3 text-xs uppercase tracking-widest">
            <option>Engagement</option>
            <option>Lead Generation</option>
            <option>Sale / Conversion</option>
            <option>Event Promotion</option>
          </select>
        </div>
        <div>
          <label className="text-[10px] uppercase text-[var(--text-muted)] font-bold mb-2 block tracking-widest">Core Message</label>
          <textarea value={context} onChange={(e) => setContext(e.target.value)} className="w-full bg-[var(--bg-input)] border border-[var(--border)] p-4 text-sm focus:border-[var(--border-hover)] outline-none h-40 resize-none" placeholder="Details about your offer, update, or news..." />
        </div>
        <button onClick={generateCopy} disabled={loading} className="w-full py-4 bg-white text-black font-bold uppercase tracking-widest text-xs">Generate Post Copy</button>
        <button onClick={() => {setContext(''); setResult('')}} className="w-full text-[10px] uppercase text-[var(--text-muted)] hover:text-red-500 font-bold tracking-widest transition-colors">Reset Generator</button>
      </div>

      <div className="md:col-span-7 bg-[var(--bg-card)] border border-[var(--border)] p-10 min-h-[400px] relative">
        <h3 className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] mb-6 font-bold">Generated Ad / Post Copy</h3>
        {result ? (
          <div className="whitespace-pre-wrap text-sm text-[var(--text-primary)] leading-relaxed font-sans">{result}</div>
        ) : (
          <div className="h-full flex items-center justify-center opacity-10 italic text-xs uppercase tracking-[0.5em] text-center">Awaiting Strategy Input</div>
        )}
        {result && (
          <button onClick={() => navigator.clipboard.writeText(result)} className="absolute top-6 right-6 text-[10px] uppercase text-[var(--text-muted)] hover:text-[var(--text-primary)] font-bold">Copy To Clipboard</button>
        )}
      </div>
    </div>
  );
};
