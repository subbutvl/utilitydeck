
import React, { useState, useMemo } from 'react';
import { GoogleGenAI, Type } from "@google/genai";

interface ShadcnTheme {
  background: string;
  foreground: string;
  primary: string;
  primaryForeground: string;
  muted: string;
  accent: string;
  border: string;
  ring: string;
}

export const ShadcnThemeBuilder: React.FC = () => {
  const [theme, setTheme] = useState<ShadcnTheme>({
    background: '#ffffff',
    foreground: '#0f172a',
    primary: '#0f172a',
    primaryForeground: '#f8fafc',
    muted: '#f1f5f9',
    accent: '#f1f5f9',
    border: '#e2e8f0',
    ring: '#0f172a'
  });

  const [aiPrompt, setAiPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'manual' | 'ai'>('manual');

  const cssOutput = useMemo(() => {
    return `:root {
  --background: ${theme.background};
  --foreground: ${theme.foreground};
  --primary: ${theme.primary};
  --primary-foreground: ${theme.primaryForeground};
  --muted: ${theme.muted};
  --accent: ${theme.accent};
  --border: ${theme.border};
  --ring: ${theme.ring};
}`;
  }, [theme]);

  const generateWithAi = async () => {
    if (!aiPrompt) return;
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Suggest a ShadCN theme for vibe: "${aiPrompt}". Use Hex codes. Return JSON.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              background: { type: Type.STRING },
              foreground: { type: Type.STRING },
              primary: { type: Type.STRING },
              primaryForeground: { type: Type.STRING },
              muted: { type: Type.STRING },
              accent: { type: Type.STRING },
              border: { type: Type.STRING },
              ring: { type: Type.STRING },
            },
            required: ['background', 'foreground', 'primary', 'primaryForeground', 'muted', 'accent', 'border', 'ring']
          }
        }
      });
      setTheme(JSON.parse(response.text));
      setActiveTab('manual');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const resetAll = () => {
    setTheme({
      background: '#ffffff',
      foreground: '#0f172a',
      primary: '#0f172a',
      primaryForeground: '#f8fafc',
      muted: '#f1f5f9',
      accent: '#f1f5f9',
      border: '#e2e8f0',
      ring: '#0f172a'
    });
    setAiPrompt('');
  };

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="flex border-b border-[var(--border)]">
        <button onClick={() => setActiveTab('manual')} className={`px-6 py-3 text-[11px] uppercase tracking-widest font-bold ${activeTab === 'manual' ? 'border-b-2 border-white text-[var(--text-primary)]' : 'text-[var(--text-muted)]'}`}>Variables</button>
        <button onClick={() => setActiveTab('ai')} className={`px-6 py-3 text-[11px] uppercase tracking-widest font-bold ${activeTab === 'ai' ? 'border-b-2 border-white text-[var(--text-primary)]' : 'text-[var(--text-muted)]'}`}>AI Vibe</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 min-h-0">
        <div className="lg:col-span-4 overflow-y-auto pb-10">
          {activeTab === 'manual' ? (
            <div className="bg-[var(--bg-card)] border border-[var(--border)] p-6 space-y-4">
              {(Object.keys(theme) as Array<keyof ShadcnTheme>).map(key => (
                <div key={key} className="flex items-center gap-3">
                  <div className="w-28 text-[9px] uppercase text-[var(--text-muted)] font-bold">{key.replace(/([A-Z])/g, '-$1')}</div>
                  <input type="color" value={theme[key]} onChange={(e) => setTheme(prev => ({...prev, [key]: e.target.value}))} className="w-8 h-8 bg-transparent cursor-pointer" />
                  <input type="text" value={theme[key].toUpperCase()} onChange={(e) => setTheme(prev => ({...prev, [key]: e.target.value}))} className="flex-1 bg-[var(--bg-input)] border border-[var(--border)] p-2 text-[10px] font-mono uppercase text-[var(--text-muted)] outline-none" />
                </div>
              ))}
              <button onClick={resetAll} className="w-full py-2 text-[10px] uppercase text-[var(--text-muted)] hover:text-red-500 font-bold transition-colors pt-4 border-t border-[var(--border)]">Reset</button>
            </div>
          ) : (
            <div className="bg-[var(--bg-card)] border border-[var(--border)] p-6 space-y-6">
              <textarea 
                value={aiPrompt} onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="Describe a professional UI vibe..."
                className="w-full h-40 bg-[var(--bg-input)] border border-[var(--border)] p-4 text-sm text-[var(--text-primary)] focus:border-[var(--border-hover)] outline-none resize-none"
              />
              <button onClick={generateWithAi} disabled={loading} className="w-full py-4 bg-white text-black font-bold uppercase tracking-widest text-xs">Analyze & Suggest</button>
            </div>
          )}
        </div>

        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="flex-1 border border-[var(--border)] p-12 overflow-auto transition-colors duration-500" style={{ backgroundColor: theme.background }}>
             <div className="max-w-sm mx-auto space-y-6">
                <div className="space-y-1">
                   <h2 className="text-xl font-bold" style={{ color: theme.foreground }}>Authentication</h2>
                   <p className="text-xs" style={{ color: theme.muted === theme.background ? theme.foreground : theme.muted }}>Enter your credentials to continue.</p>
                </div>
                <div className="space-y-4">
                   <div className="space-y-2">
                      <div className="text-[10px] font-bold uppercase" style={{ color: theme.foreground }}>Email Address</div>
                      <div className="w-full p-2.5 border" style={{ borderColor: theme.border, backgroundColor: theme.background, color: theme.foreground }} />
                   </div>
                   <button className="w-full py-2.5 text-xs font-bold uppercase tracking-widest" style={{ backgroundColor: theme.primary, color: theme.primaryForeground }}>Sign In</button>
                   <div className="flex items-center gap-4">
                      <div className="h-px flex-1" style={{ backgroundColor: theme.border }} />
                      <span className="text-[8px] uppercase font-bold" style={{ color: theme.border }}>Or</span>
                      <div className="h-px flex-1" style={{ backgroundColor: theme.border }} />
                   </div>
                   <button className="w-full py-2.5 text-xs font-bold uppercase border" style={{ borderColor: theme.border, color: theme.foreground, backgroundColor: theme.accent }}>Continue with GitHub</button>
                </div>
             </div>
          </div>

          <div className="bg-[var(--bg-card)] border border-[var(--border)] p-6 flex flex-col gap-4">
             <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase text-[var(--text-muted)] font-bold tracking-widest">Global CSS Output</span>
                <button onClick={() => navigator.clipboard.writeText(cssOutput)} className="text-[10px] uppercase text-[var(--text-muted)] hover:text-[var(--text-primary)] font-bold">Copy CSS</button>
             </div>
             <code className="block p-4 bg-[var(--bg-input)] border border-[var(--border)] text-xs text-[var(--text-muted)] font-mono whitespace-pre h-32 overflow-y-auto">
               {cssOutput}
             </code>
          </div>
        </div>
      </div>
    </div>
  );
};
