
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";

export const TweetGen: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [type, setType] = useState<'single' | 'thread'>('single');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const generateTweet = async () => {
    if (!topic) return;
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = type === 'single' 
        ? `Write a high-engagement, single viral tweet about: ${topic}. Focus on punchy delivery and a strong hook.`
        : `Write a 5-tweet engaging thread about: ${topic}. Use the standard thread structure with hooks and a conclusion.`;
      
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });
      setResult(response.text || '');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto w-full flex flex-col gap-8 pt-4">
      <div className="bg-[var(--bg-card)] border border-[var(--border)] p-8 space-y-6">
        <div className="flex bg-[var(--bg-input)] p-1 border border-[var(--border)]">
          <button onClick={() => setType('single')} className={`flex-1 py-2 text-[10px] uppercase tracking-widest font-bold ${type === 'single' ? 'bg-white text-black' : 'text-[var(--text-muted)]'}`}>Single Tweet</button>
          <button onClick={() => setType('thread')} className={`flex-1 py-2 text-[10px] uppercase tracking-widest font-bold ${type === 'thread' ? 'bg-white text-black' : 'text-[var(--text-muted)]'}`}>Thread Mode</button>
        </div>
        
        <textarea value={topic} onChange={(e) => setTopic(e.target.value)} className="w-full bg-[var(--bg-input)] border border-[var(--border)] p-4 text-sm focus:border-[var(--border-hover)] outline-none h-32 resize-none" placeholder="Enter your core message or topic..." />
        
        <div className="flex gap-4">
          <button onClick={generateTweet} disabled={loading} className="flex-1 py-4 bg-white text-black font-bold uppercase tracking-widest text-xs">Generate X Content</button>
          <button onClick={() => {setTopic(''); setResult('')}} className="px-6 border border-[var(--border)] text-[var(--text-muted)] hover:text-red-500 text-[10px] font-bold uppercase tracking-widest transition-colors">Reset</button>
        </div>
      </div>

      <div className="bg-[var(--bg-card)] border border-[var(--border)] p-10 min-h-[300px] relative">
        {result ? (
          <div className="whitespace-pre-wrap text-[var(--text-primary)] font-sans leading-relaxed">{result}</div>
        ) : (
          <div className="h-full flex items-center justify-center opacity-20 italic text-xs uppercase tracking-[0.2em]">Content preview will load here</div>
        )}
        {result && (
          <button onClick={() => navigator.clipboard.writeText(result)} className="absolute top-4 right-4 text-[10px] uppercase text-[var(--text-muted)] hover:text-[var(--text-primary)] font-bold">Copy Result</button>
        )}
      </div>
    </div>
  );
};
