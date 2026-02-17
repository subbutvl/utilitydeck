
import React, { useState, useMemo } from 'react';
import { GoogleGenAI, Type } from "@google/genai";

interface TailwindPalette {
  primary: string;
  secondary: string;
  accent: string;
  neutral: string;
}

export const TailwindThemeBuilder: React.FC = () => {
  const [colors, setColors] = useState<TailwindPalette>({
    primary: '#3b82f6',
    secondary: '#10b981',
    accent: '#f59e0b',
    neutral: '#64748b'
  });

  const [aiPrompt, setAiPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'manual' | 'ai'>('manual');

  const configOutput = useMemo(() => {
    return `// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '${colors.primary}',
          secondary: '${colors.secondary}',
          accent: '${colors.accent}',
          neutral: '${colors.neutral}',
        }
      }
    }
  }
}`;
  }, [colors]);

  const generateWithAi = async () => {
    if (!aiPrompt) return;
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Generate a Tailwind color set for: "${aiPrompt}". Return JSON only.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              primary: { type: Type.STRING },
              secondary: { type: Type.STRING },
              accent: { type: Type.STRING },
              neutral: { type: Type.STRING },
            },
            required: ['primary', 'secondary', 'accent', 'neutral']
          }
        }
      });
      setColors(JSON.parse(response.text));
      setActiveTab('manual');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const resetAll = () => {
    setColors({
      primary: '#3b82f6',
      secondary: '#10b981',
      accent: '#f59e0b',
      neutral: '#64748b'
    });
    setAiPrompt('');
  };

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="flex border-b border-[var(--border)]">
        <button onClick={() => setActiveTab('manual')} className={`px-6 py-3 text-[11px] uppercase tracking-widest font-bold ${activeTab === 'manual' ? 'border-b-2 border-white text-[var(--text-primary)]' : 'text-[var(--text-muted)]'}`}>Designer</button>
        <button onClick={() => setActiveTab('ai')} className={`px-6 py-3 text-[11px] uppercase tracking-widest font-bold ${activeTab === 'ai' ? 'border-b-2 border-white text-[var(--text-primary)]' : 'text-[var(--text-muted)]'}`}>AI Prompt</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 min-h-0">
        <div className="lg:col-span-4 space-y-6 overflow-y-auto pr-2 pb-10">
          {activeTab === 'manual' ? (
            <div className="bg-[var(--bg-card)] border border-[var(--border)] p-6 space-y-6">
              {(Object.keys(colors) as Array<keyof TailwindPalette>).map(key => (
                <div key={key}>
                  <label className="text-[10px] uppercase text-[var(--text-muted)] mb-2 block tracking-widest font-bold">{key}</label>
                  <div className="flex gap-2">
                    <input type="color" value={colors[key]} onChange={(e) => setColors(prev => ({...prev, [key]: e.target.value}))} className="w-12 h-12 bg-transparent cursor-pointer" />
                    <input type="text" value={colors[key].toUpperCase()} onChange={(e) => setColors(prev => ({...prev, [key]: e.target.value}))} className="flex-1 bg-[var(--bg-input)] border border-[var(--border)] p-2 text-xs font-mono uppercase text-[var(--text-muted)] outline-none" />
                  </div>
                </div>
              ))}
              <button onClick={resetAll} className="w-full py-2 text-[10px] uppercase text-[var(--text-muted)] hover:text-red-500 font-bold transition-colors">Reset</button>
            </div>
          ) : (
            <div className="bg-[var(--bg-card)] border border-[var(--border)] p-6 space-y-6">
              <textarea 
                value={aiPrompt} onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="Describe a Tailwind theme vibe..."
                className="w-full h-32 bg-[var(--bg-input)] border border-[var(--border)] p-4 text-sm text-[var(--text-primary)] focus:border-[var(--border-hover)] outline-none resize-none"
              />
              <button onClick={generateWithAi} disabled={loading} className="w-full py-4 bg-white text-black font-bold uppercase tracking-widest text-xs">{loading ? 'Thinking...' : 'Generate Theme'}</button>
            </div>
          )}
        </div>

        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="flex-1 border border-[var(--border)] bg-[var(--bg-input)] flex flex-col p-12 overflow-auto">
             <div className="max-w-md mx-auto w-full space-y-8">
                <div className="h-2 w-24 mb-4" style={{ backgroundColor: colors.accent }} />
                <h2 className="text-4xl font-bold text-[var(--text-primary)] leading-tight">Designing with Modern Utility Systems.</h2>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">This layout demonstrates your brand colors applied to a modern UI. Primary actions use {colors.primary}, while secondary hints use {colors.secondary}.</p>
                <div className="flex gap-4">
                   <button className="px-8 py-3 font-bold text-[var(--text-primary)] text-[10px] uppercase tracking-widest shadow-2xl" style={{ backgroundColor: colors.primary }}>Get Started</button>
                   <button className="px-8 py-3 font-bold border text-[10px] uppercase tracking-widest" style={{ borderColor: colors.neutral, color: colors.neutral }}>Documentation</button>
                </div>
                <div className="pt-8 border-t border-[var(--border)] grid grid-cols-2 gap-8">
                   <div>
                      <div className="text-xl font-bold text-[var(--text-primary)]">99.9%</div>
                      <div className="text-[10px] uppercase text-[var(--text-muted)] font-bold tracking-widest" style={{ color: colors.secondary }}>Uptime SLA</div>
                   </div>
                   <div>
                      <div className="text-xl font-bold text-[var(--text-primary)]">24/7</div>
                      <div className="text-[10px] uppercase text-[var(--text-muted)] font-bold tracking-widest" style={{ color: colors.secondary }}>Global Support</div>
                   </div>
                </div>
             </div>
          </div>

          <div className="bg-[var(--bg-card)] border border-[var(--border)] p-6 flex flex-col gap-4">
             <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase text-[var(--text-muted)] font-bold tracking-widest">Tailwind Config</span>
                <button onClick={() => navigator.clipboard.writeText(configOutput)} className="text-[10px] uppercase text-[var(--text-muted)] hover:text-[var(--text-primary)] font-bold">Copy Config</button>
             </div>
             <code className="block p-4 bg-[var(--bg-input)] border border-[var(--border)] text-xs text-[var(--text-muted)] font-mono whitespace-pre h-32 overflow-y-auto">
               {configOutput}
             </code>
          </div>
        </div>
      </div>
    </div>
  );
};
