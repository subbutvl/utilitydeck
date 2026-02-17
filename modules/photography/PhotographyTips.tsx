
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";

interface Props {
  type: 'bird' | 'astro' | 'general';
}

const FALLBACK_TIPS: Record<string, string[]> = {
  bird: [
    'Use a shutter speed of at least 1/2000s for birds in flight.',
    'Focus on the eyes—even a slightly soft body is acceptable if the eyes are sharp.',
    'Use Back-Button Focus to separate focusing from the shutter release.',
    'Shoot from the bird’s eye level for a more intimate and engaging perspective.'
  ],
  astro: [
    'Always use a sturdy tripod and a remote shutter or 2s timer.',
    'Focus manually on the brightest star using Live View zoom.',
    'Use the 500 Rule to prevent star trailing based on your focal length.',
    'Shoot in RAW to preserve detail in deep shadows and highlights.'
  ],
  general: [
    'Understand the Exposure Triangle: ISO, Shutter Speed, and Aperture.',
    'The Rule of Thirds is a starting point, not a strict law—experiment with symmetry.',
    'Golden Hour provides the most directional and softest natural light.',
    'Check your histograms regularly to ensure you aren’t clipping data.'
  ]
};

export const PhotographyTips: React.FC<Props> = ({ type }) => {
  const [aiTip, setAiTip] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const generateAiTip = async () => {
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Provide 3 unique, advanced, and expert-level tips for ${type} photography. Focus on technical settings and creative composition. Keep it minimalist and professional.`;
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt
      });
      setAiTip(response.text || null);
    } catch (err) {
      setAiTip("AI coaching unavailable. Reverting to field manual.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col gap-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 flex-1 min-h-0">
        
        {/* Manual Tips */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-[var(--bg-card)] border border-[var(--border)] p-8 space-y-8">
             <div className="flex items-center justify-between border-b border-[var(--border)] pb-2">
                <span className="text-[10px] uppercase text-[var(--text-muted)] font-bold tracking-widest">Field Manual Essentials</span>
                <span className="text-[9px] bg-[var(--bg-hover)] px-1.5 py-0.5 text-[var(--text-muted)] font-mono border border-[var(--border)] uppercase tracking-tighter">Static</span>
             </div>
             <div className="space-y-6">
                {FALLBACK_TIPS[type].map((tip, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="text-[10px] font-mono text-[var(--text-muted)] font-bold">0{i+1}</div>
                    <p className="text-xs text-[var(--text-muted)] leading-relaxed italic">{tip}</p>
                  </div>
                ))}
             </div>
          </div>
          <div className="bg-[var(--bg-card)] border border-[var(--border)] p-6 text-[10px] text-[var(--text-muted)] uppercase tracking-[0.2em] font-bold text-center italic">
            Fundamentals are the foundation of excellence.
          </div>
        </div>

        {/* AI Tips */}
        <div className="lg:col-span-7 flex flex-col gap-6">
           <div className="bg-[var(--bg-card)] border border-[var(--border)] p-8 flex-1 flex flex-col relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex items-center justify-between mb-10 z-10">
                 <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    <span className="text-[10px] uppercase text-[var(--text-primary)] font-bold tracking-widest">Gemini Pro Coaching</span>
                 </div>
                 <button onClick={generateAiTip} disabled={loading} className="text-[10px] uppercase text-[var(--text-muted)] hover:text-[var(--text-primary)] font-bold transition-colors">
                   {loading ? 'Synthesizing...' : 'Request New Insight'}
                 </button>
              </div>

              <div className="flex-1 overflow-y-auto pr-2 z-10">
                 {aiTip ? (
                   <div className="prose prose-invert max-w-none text-[var(--text-primary)] text-sm leading-loose animate-in fade-in slide-in-from-top-2 duration-700 whitespace-pre-wrap">
                      {aiTip}
                   </div>
                 ) : (
                   <div className="h-full flex flex-col items-center justify-center opacity-20 uppercase tracking-[0.5em] text-center italic">
                      <svg className="mb-6" xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
                      Awaiting AI Session
                   </div>
                 )}
              </div>
              
              <div className="mt-8 pt-4 border-t border-[var(--border)] text-[9px] text-[var(--text-muted)] uppercase font-bold tracking-widest z-10">
                * AI insights provide high-level creative strategies tailored to current technical standards.
              </div>
           </div>
        </div>

      </div>
    </div>
  );
};
