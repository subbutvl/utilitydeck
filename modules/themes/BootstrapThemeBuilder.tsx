
import React, { useState, useMemo } from 'react';
import { GoogleGenAI, Type } from "@google/genai";

interface BootstrapTheme {
  primary: string;
  secondary: string;
  success: string;
  info: string;
  warning: string;
  danger: string;
  light: string;
  dark: string;
}

export const BootstrapThemeBuilder: React.FC = () => {
  const [theme, setTheme] = useState<BootstrapTheme>({
    primary: '#0d6efd',
    secondary: '#6c757d',
    success: '#198754',
    info: '#0dcaf0',
    warning: '#ffc107',
    danger: '#dc3545',
    light: '#f8f9fa',
    dark: '#212529'
  });

  const [aiPrompt, setAiPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'manual' | 'ai'>('manual');

  const scssOutput = useMemo(() => {
    return `$theme-colors: (
  "primary": ${theme.primary},
  "secondary": ${theme.secondary},
  "success": ${theme.success},
  "info": ${theme.info},
  "warning": ${theme.warning},
  "danger": ${theme.danger},
  "light": ${theme.light},
  "dark": ${theme.dark}
);`;
  }, [theme]);

  const updateColor = (key: keyof BootstrapTheme, val: string) => {
    setTheme(prev => ({ ...prev, [key]: val }));
  };

  const generateWithAi = async () => {
    if (!aiPrompt) return;
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Generate a Bootstrap theme (hex codes) for the vibe: "${aiPrompt}". Return only JSON.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              primary: { type: Type.STRING },
              secondary: { type: Type.STRING },
              success: { type: Type.STRING },
              info: { type: Type.STRING },
              warning: { type: Type.STRING },
              danger: { type: Type.STRING },
              light: { type: Type.STRING },
              dark: { type: Type.STRING },
            },
            required: ['primary', 'secondary', 'success', 'info', 'warning', 'danger', 'light', 'dark']
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
      primary: '#0d6efd',
      secondary: '#6c757d',
      success: '#198754',
      info: '#0dcaf0',
      warning: '#ffc107',
      danger: '#dc3545',
      light: '#f8f9fa',
      dark: '#212529'
    });
    setAiPrompt('');
  };

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="flex border-b border-[var(--border)]">
        <button onClick={() => setActiveTab('manual')} className={`px-6 py-3 text-[11px] uppercase tracking-widest font-bold ${activeTab === 'manual' ? 'border-b-2 border-white text-[var(--text-primary)]' : 'text-[var(--text-muted)]'}`}>Manual Designer</button>
        <button onClick={() => setActiveTab('ai')} className={`px-6 py-3 text-[11px] uppercase tracking-widest font-bold ${activeTab === 'ai' ? 'border-b-2 border-white text-[var(--text-primary)]' : 'text-[var(--text-muted)]'}`}>AI Theme Assistant</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 min-h-0">
        <div className="lg:col-span-4 overflow-y-auto pr-2 pb-10">
          {activeTab === 'manual' ? (
            <div className="bg-[var(--bg-card)] border border-[var(--border)] p-6 space-y-4">
              <span className="text-[10px] uppercase text-[var(--text-muted)] font-bold tracking-widest block border-b border-[var(--border)] pb-2">Core Variables</span>
              {(Object.keys(theme) as Array<keyof BootstrapTheme>).map(key => (
                <div key={key} className="flex items-center gap-4">
                  <div className="w-24 text-[10px] uppercase text-[var(--text-muted)] font-bold">{key}</div>
                  <input type="color" value={theme[key]} onChange={(e) => updateColor(key, e.target.value)} className="w-10 h-10 bg-transparent cursor-pointer" />
                  <input type="text" value={theme[key].toUpperCase()} onChange={(e) => updateColor(key, e.target.value)} className="flex-1 bg-[var(--bg-input)] border border-[var(--border)] p-2 text-xs font-mono uppercase text-[var(--text-muted)] outline-none" />
                </div>
              ))}
              <button onClick={resetAll} className="w-full py-2 text-[10px] uppercase text-[var(--text-muted)] hover:text-red-500 font-bold transition-colors">Reset Defaults</button>
            </div>
          ) : (
            <div className="bg-[var(--bg-card)] border border-[var(--border)] p-6 space-y-6">
              <div>
                <label className="text-[10px] uppercase text-[var(--text-muted)] font-bold mb-3 block tracking-widest">Describe Your Brand Vibe</label>
                <textarea 
                  value={aiPrompt} 
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="e.g. A luxurious midnight blue financial portal with gold accents..."
                  className="w-full h-32 bg-[var(--bg-input)] border border-[var(--border)] p-4 text-sm text-[var(--text-primary)] focus:border-[var(--border-hover)] outline-none resize-none"
                />
              </div>
              <button 
                onClick={generateWithAi} 
                disabled={loading}
                className="w-full py-4 bg-white text-black font-bold uppercase tracking-widest text-xs hover:bg-neutral-200 transition-all"
              >
                {loading ? 'Consulting Gemini...' : 'Generate Palette'}
              </button>
            </div>
          )}
        </div>

        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="flex-1 border border-[var(--border)] bg-[#0d0d0d] p-8 overflow-auto">
             <h3 className="text-[10px] uppercase tracking-widest text-[var(--text-muted)] font-bold mb-8">Component Preview (Bootstrap 5.3 Simulated)</h3>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                {(Object.keys(theme) as Array<keyof BootstrapTheme>).map(key => (
                  <button key={key} style={{ backgroundColor: theme[key], color: key === 'light' ? '#000' : '#fff' }} className="py-3 px-4 text-[10px] font-bold uppercase tracking-widest shadow-lg">
                    {key}
                  </button>
                ))}
             </div>

             <div className="space-y-6">
                <div className="p-6 border border-[var(--border)]" style={{ borderLeft: `4px solid ${theme.primary}` }}>
                  <h4 className="text-sm font-bold mb-2 uppercase tracking-wide" style={{ color: theme.primary }}>Alert Banner / Important Note</h4>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed">This is a preview of how your theme colors interact with typical Bootstrap layouts. The primary color ({theme.primary}) is used for main calls to action and structural accents.</p>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full shadow-xl" style={{ backgroundColor: theme.primary }} />
                  <div className="w-12 h-12 rounded-full shadow-xl" style={{ backgroundColor: theme.secondary }} />
                  <div className="w-12 h-12 rounded-full shadow-xl" style={{ backgroundColor: theme.success }} />
                </div>
             </div>
          </div>

          <div className="bg-[var(--bg-card)] border border-[var(--border)] p-6 flex flex-col gap-4">
             <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase text-[var(--text-muted)] font-bold tracking-widest">SCSS Export</span>
                <button onClick={() => navigator.clipboard.writeText(scssOutput)} className="text-[10px] uppercase text-[var(--text-muted)] hover:text-[var(--text-primary)] font-bold transition-colors">Copy Variables</button>
             </div>
             <code className="block p-4 bg-[var(--bg-input)] border border-[var(--border)] text-xs text-[var(--text-muted)] font-mono whitespace-pre h-32 overflow-y-auto">
               {scssOutput}
             </code>
          </div>
        </div>
      </div>
    </div>
  );
};
